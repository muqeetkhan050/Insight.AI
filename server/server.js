
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { randomUUID } from "crypto";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

dotenv.config();

// Enhanced environment variable validation
const requiredEnvVars = ['GOOGLE_API_KEY', 'QDRANTDB_URL', 'QDRANTDB_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error('Please check your .env file');
    process.exit(1);
  }
}

console.log('✅ Environment variables loaded successfully');
console.log('🔑 Google API Key:', process.env.GOOGLE_API_KEY ? 'Present' : 'Missing');
console.log('🔗 Qdrant URL:', process.env.QDRANTDB_URL ? 'Present' : 'Missing');
console.log('🔐 Qdrant API Key:', process.env.QDRANTDB_API_KEY ? 'Present' : 'Missing');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Configure multer with enhanced error handling
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    console.log('📁 File received:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      console.error('❌ Invalid file type:', file.mimetype);
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Ensure uploads directory exists with proper permissions
if (!fs.existsSync("uploads")) {
  try {
    fs.mkdirSync("uploads", { recursive: true });
    console.log('📁 Created uploads directory');
  } catch (error) {
    console.error('❌ Failed to create uploads directory:', error.message);
    process.exit(1);
  }
}

// Initialize AI models with enhanced error handling
let embeddings, llm;

try {
  embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });
  console.log('✅ Google Embeddings initialized');
} catch (error) {
  console.error('❌ Failed to initialize embeddings:', error.message);
  process.exit(1);
}

try {
  llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0.7
  });
  console.log('✅ Google LLM initialized');
} catch (error) {
  console.error('❌ Failed to initialize LLM:', error.message);
  process.exit(1);
}

// Enhanced upload endpoint with better error handling
app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log("\n=== Upload request received ===");
  console.log('⏰ Timestamp:', new Date().toISOString());

  if (!req.file) {
    console.error('❌ No file received in request');
    return res.status(400).json({
      success: false,
      error: "No file received"
    });
  }

  let filePath = req.file.path;

  try {
    // Enhanced file validation
    const mimeType = req.file.mimetype;
    const fileSize = req.file.size;
    
    console.log("📄 File details:", {
      name: req.file.originalname,
      size: `${(fileSize / 1024).toFixed(2)} KB`,
      type: mimeType,
      path: filePath
    });

    if (!mimeType.includes('pdf')) {
      console.error('❌ Invalid file type:', mimeType);
      fs.unlink(filePath, () => {});
      return res.status(400).json({
        success: false,
        error: "Only PDF files are allowed"
      });
    }

    // Check if file exists and is readable
    if (!fs.existsSync(filePath)) {
      console.error('❌ Uploaded file not found:', filePath);
      return res.status(500).json({
        success: false,
        error: "File upload failed - file not found"
      });
    }

    // Load PDF with enhanced error handling
    console.log('📖 Loading PDF...');
    let docs;
    try {
      const loader = new PDFLoader(filePath);
      docs = await loader.load();
      console.log(`✅ PDF loaded successfully: ${docs.length} pages`);
    } catch (pdfError) {
      console.error('❌ PDF loading failed:', {
        message: pdfError.message,
        stack: pdfError.stack
      });
      fs.unlink(filePath, () => {});
      return res.status(400).json({
        success: false,
        error: `PDF processing failed: ${pdfError.message}`
      });
    }

    if (!docs || docs.length === 0) {
      console.error('❌ No content found in PDF');
      fs.unlink(filePath, () => {});
      return res.status(400).json({
        success: false,
        error: "PDF appears to be empty or unreadable"
      });
    }

    // Create collection with enhanced error handling
    const collectionName = randomUUID();
    console.log('🗄️ Creating Qdrant collection:', collectionName);

    let vectorStore;
    try {
      // Test Qdrant connection first
      console.log('🔗 Testing Qdrant connection...');
      
      vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: process.env.QDRANTDB_URL,
        apiKey: process.env.QDRANTDB_API_KEY,
        collectionName,
      });
      
      console.log('✅ Vector store created successfully');
    } catch (vectorError) {
      console.error('❌ Vector store creation failed:', {
        message: vectorError.message,
        stack: vectorError.stack,
        qdrantUrl: process.env.QDRANTDB_URL,
        hasApiKey: !!process.env.QDRANTDB_API_KEY
      });
      
      fs.unlink(filePath, () => {});
      
      // Provide more specific error messages
      if (vectorError.message.includes('401') || vectorError.message.includes('authentication')) {
        return res.status(500).json({
          success: false,
          error: "Qdrant authentication failed. Please check your API key."
        });
      } else if (vectorError.message.includes('connection') || vectorError.message.includes('ECONNREFUSED')) {
        return res.status(500).json({
          success: false,
          error: "Cannot connect to Qdrant database. Please check the URL."
        });
      } else if (vectorError.message.includes('quota') || vectorError.message.includes('rate limit')) {
        return res.status(500).json({
          success: false,
          error: "API quota exceeded. Please try again later."
        });
      } else {
        return res.status(500).json({
          success: false,
          error: `Vector store creation failed: ${vectorError.message}`
        });
      }
    }

    // Cleanup uploaded file
    fs.unlink(filePath, (unlinkError) => {
      if (unlinkError) {
        console.warn('⚠️ Failed to cleanup uploaded file:', unlinkError.message);
      } else {
        console.log('🧹 Cleaned up uploaded file');
      }
    });

    console.log('✅ Upload completed successfully');
    return res.status(200).json({
      success: true,
      fileName: req.file.originalname,
      fileSize: fileSize,
      collectionName,
      pages: docs.length
    });

  } catch (error) {
    // Enhanced error logging
    console.error('❌ Upload error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      fileName: req.file?.originalname,
      timestamp: new Date().toISOString()
    });

    // Cleanup on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Enhanced chat endpoint
app.post("/api/chat", async (req, res) => {
  console.log('\n=== Chat request received ===');
  
  try {
    const { question, collectionName } = req.body;

    if (!question) {
      console.error('❌ No question provided');
      return res.status(400).json({ error: "Question is required" });
    }
    
    if (!collectionName) {
      console.error('❌ No collection name provided');
      return res.status(400).json({ error: "Collection name is required" });
    }

    console.log('💬 Question:', question);
    console.log('🗄️ Collection:', collectionName);

    // Create vector store connection with error handling
    let vectorStore;
    try {
      vectorStore = new QdrantVectorStore(embeddings, {
        url: process.env.QDRANTDB_URL,
        apiKey: process.env.QDRANTDB_API_KEY,
        collectionName,
      });
      console.log('✅ Connected to vector store');
    } catch (connectionError) {
      console.error('❌ Vector store connection failed:', connectionError.message);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to connect to document database" 
      });
    }

    const retriever = vectorStore.asRetriever({ k: 4 });

    const prompt = PromptTemplate.fromTemplate(`
      You are a helpful AI assistant that answers questions based on the provided context.
      Use only the information from the context to answer the question.
      If the answer cannot be found in the context, say "I cannot find the answer in the provided document."

      Context: {context}

      Question: {question}

      Answer:
    `);

    const ragChain = RunnableSequence.from([
      {
        context: retriever.pipe((docs) => docs.map((doc) => doc.pageContent).join("\n\n")),
        question: new RunnablePassthrough(),
      },
      prompt,
      llm,
      new StringOutputParser(),
    ]);

    console.log('🤖 Generating answer...');
    const answer = await ragChain.invoke(question);
    console.log('✅ Answer generated successfully');

    return res.status(200).json({ success: true, answer, question });
  } catch (err) {
    console.error("❌ Chat error:", {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    
    return res.status(500).json({ 
      success: false, 
      message: "Error processing your question",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Health check with more details
app.get("/api/health", (req, res) => {
  const healthStatus = {
    status: "Server is running!",
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      port: PORT
    },
    services: {
      googleAI: !!process.env.GOOGLE_API_KEY,
      qdrant: !!(process.env.QDRANTDB_URL && process.env.QDRANTDB_API_KEY)
    }
  };
  
  console.log('🏥 Health check:', healthStatus);
  res.json(healthStatus);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Server started successfully!');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`📚 Upload endpoint: http://localhost:${PORT}/api/upload`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log('\n📋 Environment check:');
  console.log('   - Google API Key:', process.env.GOOGLE_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('   - Qdrant URL:', process.env.QDRANTDB_URL ? '✅ Present' : '❌ Missing');
  console.log('   - Qdrant API Key:', process.env.QDRANTDB_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('\n🎯 Ready to accept requests!\n');
});
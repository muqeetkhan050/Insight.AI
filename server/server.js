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

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Multer for handling uploads
const upload = multer({ dest: "uploads/" });
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads", { recursive: true });

// Initialize embeddings and chat model
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});
const llm = new ChatGoogleGenerativeAI({ model: "gemini-1.5-flash", temperature: 0.7 });

// --- Upload endpoint ---
app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log("=== Upload request received ===");

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No file received"
    });
  }

  try {
    // Validate file type
    const mimeType = req.file.mimetype;
    if (!mimeType.includes('pdf')) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        success: false,
        error: "Only PDF files are allowed"
      });
    }

    // Log file details
    console.log("File details:", {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      path: req.file.path
    });

    // Load PDF
    const loader = new PDFLoader(req.file.path);
    const docs = await loader.load();
    console.log("PDF loaded, pages:", docs.length);

    // Create collection
    const collectionName = randomUUID();
    console.log("Creating collection:", collectionName);

    const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANTDB_URL,
      apiKey: process.env.QDRANTDB_API_KEY,
      collectionName,
    });

    // Cleanup
    fs.unlink(req.file.path, () => {});

    return res.status(200).json({
      success: true,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      collectionName
    });

  } catch (error) {
    // Cleanup on error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    console.error("Upload error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// --- Chat endpoint ---
app.post("/api/chat", async (req, res) => {
  try {
    const { question, collectionName } = req.body;

    if (!question) return res.status(400).json({ error: "Question is required" });
    if (!collectionName) return res.status(400).json({ error: "Collection name is required" });

    const vectorStore = new QdrantVectorStore(embeddings, {
      url: process.env.QDRANTDB_URL,
      apiKey: process.env.QDRANTDB_API_KEY,
      collectionName,
    });

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

    const answer = await ragChain.invoke(question);

    return res.status(200).json({ success: true, answer, question });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ success: false, message: "Error processing your question" });
  }
});

// --- Health check ---
app.get("/api/health", (req, res) => res.json({ status: "Server is running!" }));

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Upload endpoint: http://localhost:${PORT}/api/upload`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});

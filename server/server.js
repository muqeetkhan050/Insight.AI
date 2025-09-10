import express from "express";
import multer from "multer";
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

// ✅ Environment check
const requiredEnvVars = ["GOOGLE_API_KEY", "QDRANTDB_URL", "QDRANTDB_API_KEY"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing env variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// ✅ File upload setup
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) =>
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDF files are allowed")),
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// ✅ AI models
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-1.5-flash",
  temperature: 0.7,
});

// ==========================
// 📚 Upload Endpoint
// ==========================
app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "No file received" });

  const filePath = req.file.path;

  try {
    // Load PDF
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    if (!docs.length) throw new Error("PDF is empty or unreadable");

    // Create Qdrant collection
    const collectionName = randomUUID();
    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANTDB_URL,
      apiKey: process.env.QDRANTDB_API_KEY,
      collectionName,
    });

    fs.unlink(filePath, () => {}); // cleanup

    return res.status(200).json({
      success: true,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      collectionName,
      pages: docs.length,
    });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlink(filePath, () => {});
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
// 💬 Chat Endpoint
// ==========================
app.post("/api/chat", async (req, res) => {
  const { question, collectionName } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });
  if (!collectionName) return res.status(400).json({ error: "Collection name is required" });

  try {
    const vectorStore = new QdrantVectorStore(embeddings, {
      url: process.env.QDRANTDB_URL,
      apiKey: process.env.QDRANTDB_API_KEY,
      collectionName,
    });

    const retriever = vectorStore.asRetriever({ k: 4 });
    const prompt = PromptTemplate.fromTemplate(`
      You are a helpful AI assistant that answers based on the provided context.
      If the answer cannot be found, say "I cannot find the answer in the provided document."

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
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
// 🏥 Health Check
// ==========================
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    timestamp: new Date().toISOString(),
    services: {
      googleAI: !!process.env.GOOGLE_API_KEY,
      qdrant: !!(process.env.QDRANTDB_URL && process.env.QDRANTDB_API_KEY),
    },
  });
});

// ==========================
// 🚀 Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

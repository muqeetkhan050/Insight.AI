

// Import necessary libraries
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { randomUUID } from "crypto"; // Node.js built-in crypto module

// Load environment variables from .env file
dotenv.config();

// --- Server and Middleware Setup ---
const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS so your React app can talk to this server
app.use(cors());

// Multer setup for temporary file storage
// This tells Multer to save uploaded files in a directory named 'uploads'
const upload = multer({ dest: "uploads/" });

// --- API Endpoint for File Upload ---
// The core logic is moved here
 app.post("/api/upload", upload.single("file"), async (req, res) => {
//   // 'upload.single("file")' processes the file and makes it available as req.file
   try {
     const file = req.file;
     // 1. Validate the uploaded file
     if (!file) {
       return res.status(400).json({ error: "No file uploaded" });
    }

     const allowedTypes = [".pdf"];
     const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return res
         .status(400)
         .json({ error: "Invalid file type. Only PDF files are allowed." });
     }
    
//     // The file is already saved temporarily by Multer at 'file.path'
     const filePath = file.path;

     // 2. Load the PDF document
     const loader = new PDFLoader(filePath);
     const docs = await loader.load();

//     // 3. Create embeddings
     const embeddings = new GoogleGenerativeAIEmbeddings({
       model: "text-embedding-004",
       taskType: TaskType.RETRIEVAL_DOCUMENT,
     });

    // 4. Store documents in Qdrant
    const collectionName = randomUUID();
    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANTDB_URL,
      apiKey: process.env.QDRANTDB_API_KEY,
      collectionName: collectionName,
    });

    // 5. Clean up the temporary file
    fs.unlinkSync(filePath);

    // 6. Send a success response
    return res.status(200).json({
      success: true,
      fileName: file.originalname,
      collectionName: collectionName,
      fileSize: file.size,
      fileType: file.mimetype,
    });

  } catch (error) {
    console.error("File upload error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
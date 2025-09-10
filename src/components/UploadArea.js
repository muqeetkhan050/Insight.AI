

import React, { useState } from 'react';

const UploadArea = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("No file uploaded");
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    if (file.type !== 'application/pdf') {
      setError("Only PDF files are allowed");
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      setStatus("Uploading and processing...");
      setError(null);

      console.log('📤 Starting upload for file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const formData = new FormData();
      formData.append("file", file);

      // First, test if server is reachable
      try {
        const healthResponse = await fetch("http://localhost:8000/api/health");
        if (!healthResponse.ok) {
          throw new Error("Server is not responding properly");
        }
        console.log('✅ Server health check passed');
      } catch (healthError) {
        console.error('❌ Server health check failed:', healthError);
        throw new Error("Cannot connect to server. Make sure the server is running on port 8000.");
      }

      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log('📥 Server response:', data);

      if (!response.ok) {
        // Handle specific error types
        if (response.status === 400) {
          throw new Error(data.error || "Invalid file or request");
        } else if (response.status === 500) {
          throw new Error(data.error || "Server error occurred while processing the file");
        } else {
          throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }
      }

      setStatus("Upload successful!");
      setFileInfo({
        name: data.fileName,
        size: data.fileSize,
        collection: data.collectionName,
        pages: data.pages
      });

      console.log('✅ Upload completed successfully');

      if (onUploaded) {
        onUploaded(data.collectionName);
      }

    } catch (error) {
      console.error("❌ Upload failed:", error);
      
      // Provide user-friendly error messages
      let userMessage = error.message;
      
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        userMessage = "Cannot connect to server. Please check if the server is running.";
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        userMessage = "API quota exceeded. Please try again later.";
      } else if (error.message.includes('authentication') || error.message.includes('401')) {
        userMessage = "Authentication error. Please check API configuration.";
      } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
        userMessage = "Cannot connect to database. Please check server configuration.";
      }
      
      setError(userMessage);
      setStatus("Upload failed");
      setFileInfo(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setFileInfo(null);
    
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError("Only PDF files are allowed");
        setStatus("Invalid file type");
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10MB.");
        setStatus("File too large");
        return;
      }
      
      setStatus(`Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`);
    } else {
      setStatus("No file selected");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setStatus("No file uploaded");
    setError(null);
    setFileInfo(null);
    setIsUploading(false);
    // Reset file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div style={{ 
      padding: "20px", 
      border: "2px dashed #ccc", 
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      textAlign: "center",
      maxWidth: "500px",
      margin: "0 auto"
    }}>
      <h3 style={{ marginTop: 0, color: "#333" }}>Upload PDF Document</h3>
      
      <input
        id="file-input"
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        disabled={isUploading}
        style={{
          marginBottom: "15px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: isUploading ? "#f5f5f5" : "white",
          width: "100%",
          maxWidth: "300px"
        }}
      />
      
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={handleUpload}
          disabled={!file || isUploading || error}
          style={{
            padding: "10px 20px",
            backgroundColor: (!file || isUploading || error) ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: (!file || isUploading || error) ? "not-allowed" : "pointer",
            fontSize: "16px",
            marginRight: "10px",
            minWidth: "100px"
          }}
        >
          {isUploading ? "Processing..." : "Upload"}
        </button>
        
        {(file || fileInfo) && (
          <button
            onClick={resetUpload}
            disabled={isUploading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isUploading ? "not-allowed" : "pointer",
              fontSize: "16px"
            }}
          >
            Reset
          </button>
        )}
      </div>
      
      {error && (
        <div style={{
          padding: "10px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb",
          borderRadius: "4px",
          marginBottom: "10px"
        }}>
          <strong>❌ Error: </strong>{error}
        </div>
      )}
      
      {status && !error && (
        <div style={{
          padding: "10px",
          backgroundColor: isUploading ? "#fff3cd" : "#d4edda",
          color: isUploading ? "#856404" : "#155724",
          border: `1px solid ${isUploading ? "#ffeaa7" : "#c3e6cb"}`,
          borderRadius: "4px",
          marginBottom: "10px"
        }}>
          <strong>{isUploading ? "⏳" : "📄"} </strong>{status}
        </div>
      )}
      
      {fileInfo && (
        <div style={{
          padding: "15px",
          backgroundColor: "#d1ecf1",
          border: "1px solid #bee5eb",
          borderRadius: "4px",
          textAlign: "left",
          marginTop: "10px"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#0c5460" }}>✅ Upload Successful!</h4>
          <p style={{ margin: "5px 0" }}><strong>File:</strong> {fileInfo.name}</p>
          <p style={{ margin: "5px 0" }}><strong>Size:</strong> {(fileInfo.size / 1024).toFixed(2)} KB</p>
          <p style={{ margin: "5px 0" }}><strong>Pages:</strong> {fileInfo.pages}</p>
          <p style={{ margin: "5px 0" }}><strong>Collection ID:</strong> {fileInfo.collection.substring(0, 8)}...</p>
          <p style={{ margin: "10px 0 0 0", color: "#0c5460", fontStyle: "italic" }}>
            🎉 You can now ask questions about this document!
          </p>
        </div>
      )}
      
      <div style={{ 
        marginTop: "15px", 
        fontSize: "12px", 
        color: "#666",
        textAlign: "left"
      }}>
        <p><strong>Requirements:</strong></p>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>Only PDF files are supported</li>
          <li>Maximum file size: 10MB</li>
          <li>Make sure the server is running on port 8000</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadArea;
import React, { useState } from "react";



const UploadArea = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("No file uploaded");
  const [fileInfo, setFileInfo] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    try {
      setStatus("Uploading...");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus("Upload successful!");
      setFileInfo({
        name: data.fileName,
        size: data.fileSize,
        collection: data.collectionName
      });

      if (onUploaded) {
        onUploaded(data.collectionName);
      }

    } catch (error) {
      console.error("Upload failed:", error);
      setStatus(`Error: ${error.message}`);
      setFileInfo(null);
    }
  };

  return (
    <div
      style={{
        width: "30%",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h3>Upload PDF</h3>
      <input
        type="file"
        name="file" 
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{
          marginBottom: "10px",
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      />
      <button 
        onClick={handleUpload} 
        style={{ 
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Upload
      </button>
      <p style={{ 
        marginTop: "15px", 
        fontSize: "14px",
        color: status.includes("Error") ? "#dc3545" : "#28a745"
      }}>
        {status}
      </p>

      {fileInfo && (
        <div style={{ 
          marginTop: "15px", 
          backgroundColor: "#fff", 
          padding: "15px",
          borderRadius: "6px",
          border: "1px solid #ddd"
        }}>
          <strong>File Info:</strong>
          <p style={{ margin: "5px 0" }}>Name: {fileInfo.name}</p>
          <p style={{ margin: "5px 0" }}>Size: {(fileInfo.size / 1024).toFixed(2)} KB</p>
          <p style={{ margin: "5px 0" }}>Type: {fileInfo.type}</p>
          <p style={{ margin: "5px 0" }}>Collection: {fileInfo.collection}</p>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
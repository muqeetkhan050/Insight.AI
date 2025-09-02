import React from "react";

export default function UploadArea() {
  return (
    <div style={{
      width: "20%",          // 1 part of 1:4 ratio
      backgroundColor: "#f0f0f0",
      padding: "10px",
      height: "100vh",
      boxSizing: "border-box"
    }}>
      <h3>Upload PDF</h3>
      <input type="file" />
    </div>
  );
}

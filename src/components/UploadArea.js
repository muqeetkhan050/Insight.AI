


// import React, { useState } from "react";
// import PropTypes from "prop-types";

// export default function UploadArea({ onUploaded }) {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("No file uploaded");

//   const handleUpload = async () => {
//     if (!file) {
//       setStatus("File Uploading");
//       const formData = new FormData();
//       formData.append("file", file);
//       try {
//         const res = await fetch("/api/Upload", {
//           method: "POST",
//           body: formData,
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setStatus(`Success! Collection: ${data.collectionName}`);
//           if (onUploaded) onUploaded(data.collectionName);
//         } else {
//           setStatus(`Error: ${data.error || data.message}`);
//         }
//       } catch (error) {
//         console.log(error);
//         setStatus("Error uploading file");
//       }
//     }
//   };

//   return (
//     <div
//       style={{
//         width: "20%", // 1 part of 1:4 ratio
//         backgroundColor: "#f0f0f0",
//         padding: "10px",
//         height: "100vh",
//         boxSizing: "border-box",
//       }}
//     >
//       <h3>Upload PDF</h3>
//       <input
//         accept=".pdf"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//         type="file"
//       />
//       <button onClick={handleUpload}>Upload</button>
//       <p>{status}</p>
//     </div>
//   );
// }

// // Define prop types for runtime checking
// UploadArea.propTypes = {
//   onUploaded: PropTypes.func.isRequired,
// };

import React, { useState } from "react";
import PropTypes from "prop-types";

export default function UploadArea({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("No file uploaded");
  const [fileInfo, setFileInfo] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    setStatus("File Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setStatus(`Upload Success!`);
        setFileInfo({
          name: data.fileName,
          size: data.fileSize,
          type: data.fileType,
          collection: data.collectionName,
        });
        if (onUploaded) onUploaded(data.collectionName);
      } else {
        setStatus(`Error: ${data.error || data.message}`);
        setFileInfo(null);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error uploading file");
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
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} style={{ marginTop: "10px" }}>
        Upload
      </button>
      <p>{status}</p>

      {fileInfo && (
        <div style={{ marginTop: "10px", backgroundColor: "#fff", padding: "10px" }}>
          <strong>File Info:</strong>
          <p>Name: {fileInfo.name}</p>
          <p>Size: {fileInfo.size} bytes</p>
          <p>Type: {fileInfo.type}</p>
          <p>Collection: {fileInfo.collection}</p>
        </div>
      )}
    </div>
  );
}

UploadArea.propTypes = {
  onUploaded: PropTypes.func.isRequired,
};

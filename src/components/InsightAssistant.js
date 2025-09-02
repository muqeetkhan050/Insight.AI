

// import React from "react";

// const InsightAssistant = () => {
//   return (
//     <div style={{
//       width: "100%",               
//       backgroundColor: "#ffffff",
//       boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//       padding: "8px 16px",         // tighter vertical and horizontal padding
//       display: "flex",
//       justifyContent: "flex-start", // align content to left
//       boxSizing: "border-box",
//       alignItems: "center"
//     }}>
//       {/* Inner content container */}
//       <div style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start"     // title & subtitle aligned left
//       }}>
//         {/* Title */}
//         <h1 style={{
//           fontSize: "22px",
//           fontWeight: "700",
//           color: "#2563eb",
//           margin: 0
//         }}>
//           InsightAI
//         </h1>

//         {/* Subtitle */}
//         <p style={{
//           marginTop: "2px",
//           fontSize: "13px",
//           fontWeight: "350",
//           color: "#6b7280"
//         }}>
//           Ask me anything about documents
//         </p>
//       </div>
//     </div>
//   );
// };

// export default InsightAssistant;


import React from "react";
import InsightAssistant from "./InsightAssistant"; // make sure filename is correct

export default function ChatBox() {
  return (
    <div
      style={{
        width: "80%",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        boxSizing: "border-box",
        borderLeft: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Chat content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        <InsightAssistant />
      </div>

      {/* Input bar */}
      <div
        style={{
          display: "flex",
          width: "100%",
          borderTop: "1px solid #ccc",
          padding: "10px",
          boxSizing: "border-box",
          gap: "10px",
          backgroundColor: "#ffffff",
        }}
      >
        <input
          type="text"
          placeholder="Ask about your document"
          style={{
            flex: 2,
            padding: "10px 15px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          style={{
            flex: 1,
            borderRadius: "50%",
            backgroundColor: "#4f46e5", // nice purple color
            border: "none",
            color: "white",
            cursor: "pointer",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          {/* You can replace "→" with an icon from react-icons or an SVG */}
          →
        </button>
      </div>
    </div>
  );
}

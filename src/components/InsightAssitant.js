

import React from "react";

const InsightAssistant = () => {
  return (
    <div style={{
      width: "100%",               
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      padding: "8px 16px",         // tighter vertical and horizontal padding
      display: "flex",
      justifyContent: "flex-start", // align content to left
      boxSizing: "border-box",
      alignItems: "center"
    }}>
      {/* Inner content container */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"     // title & subtitle aligned left
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "#2563eb",
          margin: 0
        }}>
          InsightAI
        </h1>

        {/* Subtitle */}
        <p style={{
          marginTop: "2px",
          fontSize: "13px",
          fontWeight: "350",
          color: "#6b7280"
        }}>
          Ask me anything about documents
        </p>
      </div>
    </div>
  );
};

export default InsightAssistant;

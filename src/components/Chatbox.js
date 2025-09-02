
// import React from "react";
// import InsightAssistant from "./InsightAssitant";

// export default function ChatBox() {
//   return (
//     <div style={{
//       width: "80%",          
//       backgroundColor: "#ffffff",
//       padding: "0px",       // remove padding so navbar aligns perfectly
//       height: "100vh",
//       boxSizing: "border-box",
//       borderLeft: "1px solid #ccc",
//       display: "flex",
//       flexDirection: "column"
//     }}>
//       <InsightAssistant />
//       <div>
//         <input placeholder='Ask about your document'/>
//         <button>ask</button>
//       </div>
//     </div>
//   );
// }

import React from "react";
import InsightAssistant from "./InsightAssistant"; // fixed typo

export default function ChatBox() {
  return (
    <div
      style={{
        width: "80%",
        height: "100vh",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        borderLeft: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Chat content fills the remaining space */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        <InsightAssistant />
      </div>

      {/* Input bar fixed at bottom */}
      <div
        style={{
          display: "flex",
          width: "100%",
          borderTop: "1px solid #ccc",
          padding: "10px",
          boxSizing: "border-box",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Ask about your document"
          style={{ flex: 2, padding: "8px" }}
        />
        <button style={{ flex: 1, padding: "8px" }}>Ask</button>
      </div>
    </div>
  );
}

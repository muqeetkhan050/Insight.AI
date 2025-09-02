// import React from "react";
// import InsightAssistant from "./InsightAssitant";
// export default function ChatBox() {
//   return (
//     <div style={{
//       width: "80%",          // 4 parts of 1:4 ratio
//       backgroundColor: "#ffffff",
//       padding: "10px",
//       height: "100vh",
//       boxSizing: "border-box",
//       borderLeft: "1px solid #ccc"
//     }}>
//         <InsightAssistant />
//       {/* Chat content */}
//     </div>
//   );
// }

import React from "react";
import InsightAssistant from "./InsightAssitant";

export default function ChatBox() {
  return (
    <div style={{
      width: "80%",          
      backgroundColor: "#ffffff",
      padding: "0px",       // remove padding so navbar aligns perfectly
      height: "100vh",
      boxSizing: "border-box",
      borderLeft: "1px solid #ccc",
      display: "flex",
      flexDirection: "column"
    }}>
      <InsightAssistant />
      
      {/* Chat content */}
      <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        {/* Messages or chat input will go here */}
      </div>
    </div>
  );
}

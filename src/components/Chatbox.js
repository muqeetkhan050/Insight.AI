
// import React from "react";
import InsightAssistant from "./InsightAssistant"; // fixed typo

// export default function Chatbox() {
//   return (
//     <div
//       style={{
//         width: "80%",
//         height: "100vh",
//         backgroundColor: "#ffffff",
//         boxSizing: "border-box",
//         borderLeft: "1px solid #ccc",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Chat content fills the remaining space */}
//       <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
//         <InsightAssistant />
//       </div>

//       {/* Input bar fixed at bottom */}
//       <div
//         style={{
//           display: "flex",
//           width: "100%",
//           borderTop: "1px solid #ccc",
//           padding: "10px",
//           boxSizing: "border-box",
//           gap: "10px",
//         }}
//       >
//         <input
//           type="text"
//           placeholder="Ask about your document"
//           style={{ flex: 2, padding: "8px" }}
//         />
//         <button style={{ flex: 1, padding: "8px" }}>Ask</button>
//       </div>
//     </div>
//   );
// }





import react from 'react';
import {useState} from 'react';

const Chatbox=()=>{
  const [messages,setMessages]=useState([]);
  const [inputValue,setInputValue]=useState('')

  const handleClick=()=>{
    if(!inputValue.trim()) return;
    setMessages((prev)=>[...prev,{type:"user",text:inputValue}]);
    setInputValue('');
    // Add AI response logic here later
  }
  return(
    <div style={{flex:1,padding:"20px",display:"flex",flexDirection:"column",backgroundColor:"#fff"}}>
      <InsightAssistant/>
      <h3>Chat with your document</h3>
      <div style={{flex:1,overflowY:"auto",marginBottom:"10px",border:"1px solid #ccc",padding:"10px"}}>
        <p>Welcome! Ask me anything about your documents.</p>
        {messages.map((msg,index)=>(
          <p key={index} style={{textAlign:msg.type==="user"?"right":"left"}}>
            <strong>{msg.type==="user"?"You":"AI"}:</strong> {msg.text}
          </p>
        ))}
        
      </div>
      <div>
        <input value={inputValue} 
        onChange={(e)=>setInputValue(e.target.value)}
        placeholder='Type your message...' style={{width:"80%",padding:"5px"}}/>
        <button onClick={handleClick} style={{padding:"5px 10px",marginLeft:"5px"}}>Send</button>
      </div>
    </div>
  )
}

export default Chatbox;


// import React, { useState } from "react";

// const Chatbox = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");

//   const handleSend = () => {
//     if (!inputValue.trim()) return;
//     setMessages((prev) => [...prev, { type: "user", text: inputValue }]);
//     setInputValue("");
//     // You can add AI response logic here later
//   };

//   return (
//     <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
//           <InsightAssistant />
//       <h3>Chat</h3>
//       <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
//         {messages.map((msg, index) => (
//           <p key={index} style={{ textAlign: msg.type === "user" ? "right" : "left" }}>
//             <strong>{msg.type === "user" ? "You" : "AI"}:</strong> {msg.text}
//           </p>
//         ))}
//       </div>
//       <div>
//         <input
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           placeholder="Type your message..."
//           style={{ width: "80%", padding: "5px" }}
//         />
//         <button onClick={handleSend} style={{ padding: "5px 10px", marginLeft: "5px" }}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chatbox;

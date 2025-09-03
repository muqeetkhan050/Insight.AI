
import Chatbox from "./Chatbox";
import UploadArea from "./UploadArea";
import { useState } from "react";

const ChatWithUpload = () => {
    // const [messages,setMessages]=useState([]);
    // const [inputValue,setInputValue]=useState("");
    // const [isLoading,setIsLoading]=useState(false);
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        
      <UploadArea />
      <Chatbox />
      {/* <input value={inputValue}/> */}
    </div>
  );
}

export default ChatWithUpload;

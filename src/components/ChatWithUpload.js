
import Chatbox from "./Chatbox";
import UploadArea from "./UploadArea";
import { useState } from "react";

const ChatWithUpload = () => {

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        
      <UploadArea />
      <Chatbox />
      {/* <input value={inputValue}/> */}
    </div>
  );
}

export default ChatWithUpload;

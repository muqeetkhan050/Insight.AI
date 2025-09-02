import ChatBox from "./Chatbox";
import UploadArea from "./UploadArea";

const ChatWithUpload = () => {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        
      <UploadArea />
      <ChatBox />
    </div>
  );
}

export default ChatWithUpload;
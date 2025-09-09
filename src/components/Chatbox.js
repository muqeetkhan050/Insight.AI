
import React, { useState } from 'react';

const Chatbox = ({ collectionName }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!inputValue.trim()) return;
    
    if (!collectionName) {
      alert("Please upload a document first!");
      return;
    }

    const userMessage = { type: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: inputValue,
          collectionName: collectionName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = { type: "ai", text: data.answer };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage = { 
          type: "ai", 
          text: `Error: ${data.error || data.message || 'Something went wrong'}` 
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = { 
        type: "ai", 
        text: "Sorry, I couldn't process your question. Make sure the server is running." 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div style={{
      flex: 1,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
      height: "100vh",
      boxSizing: "border-box"
    }}>
      <h3>Chat with your document</h3>
      
      {!collectionName && (
        <div style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "10px",
          color: "#856404"
        }}>
          📄 Please upload a PDF document first to start chatting!
        </div>
      )}

      <div style={{
        flex: 1,
        overflowY: "auto",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "15px",
        backgroundColor: "#fafafa"
      }}>
        <p style={{ color: "#666", fontStyle: "italic" }}>
          Welcome! Ask me anything about your documents.
        </p>
        
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: msg.type === "user" ? "#e3f2fd" : "#f5f5f5",
            alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
            maxWidth: "80%",
            marginLeft: msg.type === "user" ? "auto" : "0",
            marginRight: msg.type === "user" ? "0" : "auto"
          }}>
            <strong style={{ color: msg.type === "user" ? "#1976d2" : "#388e3c" }}>
              {msg.type === "user" ? "You" : "AI"}:
            </strong>
            <div style={{ 
              marginTop: "5px", 
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            padding: "10px",
            fontStyle: "italic",
            color: "#666",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            marginBottom: "10px"
          }}>
            🤔 AI is thinking...
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={collectionName ? "Type your question..." : "Upload a document first"}
          disabled={!collectionName || isLoading}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        />
        <button
          onClick={handleClick}
          disabled={!collectionName || isLoading || !inputValue.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor: (!collectionName || isLoading || !inputValue.trim()) ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: (!collectionName || isLoading || !inputValue.trim()) ? "not-allowed" : "pointer",
            fontSize: "14px"
          }}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
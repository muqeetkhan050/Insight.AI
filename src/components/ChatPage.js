import React, { useState } from 'react';
import UploadArea from './UploadArea';
import Chatbox from './Chatbox';

const ChatPage = ({ onBackToHome }) => {
  const [currentCollection, setCurrentCollection] = useState(null);

  const handleFileUploaded = (collectionName) => {
    setCurrentCollection(collectionName);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        <button
          onClick={onBackToHome}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Home
        </button>
      </div>
      <UploadArea onUploaded={handleFileUploaded} />
      <Chatbox collectionName={currentCollection} />
    </div>
  );
};

export default ChatPage;
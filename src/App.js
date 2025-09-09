import { Routes, Route } from 'react-router-dom';
import './App.css';
import InsightLandingPage from './components/InsightLandingPage';
import ChatWithUpload from './components/ChatWithUpload';
import Chatbox from './components/Chatbox';
import ChatPage from './components/ChatPage';


import React, { useState } from 'react';
import UploadArea from './components/UploadArea';
// import Chatbox from './Chatbox';

// function App() {
//   const [currentCollection, setCurrentCollection] = useState(null);

//   const handleFileUploaded = (collectionName) => {
//     setCurrentCollection(collectionName);
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
//       <UploadArea onUploaded={handleFileUploaded} />
//       <Chatbox collectionName={currentCollection} />
//     </div>
//   );
// }

// export default App;
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
      {currentPage === 'home' ? (
        <InsightLandingPage onNavigateToChat={() => setCurrentPage('chat')} />
      ) : (
        <ChatPage onBackToHome={() => setCurrentPage('home')} />
      )}
    </div>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import InsightLandingPage from './components/InsightLandingPage';
import ChatPage from './components/ChatPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [error, setError] = useState(null);

  return (
    <div>
      {error && (
        <div style={{ 
          position: 'fixed', 
          top: 20, 
          right: 20, 
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
      
      {currentPage === 'home' ? (
        <InsightLandingPage 
          onNavigateToChat={() => {
            setCurrentPage('chat');
            setError(null);
          }} 
        />
      ) : (
        <ChatPage 
          onBackToHome={() => {
            setCurrentPage('home');
            setError(null);
          }}
          onError={setError}
        />
      )}
    </div>
  );
}

export default App;
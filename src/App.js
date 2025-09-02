import { Routes, Route } from 'react-router-dom';
import './App.css';
import InsightLandingPage from './components/InsightLandingPage';
import ChatWithUpload from './components/ChatWithUpload';

function App() {
  return (
    <Routes>
      <Route path='/' element={<InsightLandingPage />} />
      <Route path='/Chat' element={<ChatWithUpload/>} />

    </Routes>
  );
}

export default App;




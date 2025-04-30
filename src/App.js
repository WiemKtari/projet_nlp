// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecruiterPage from './pages/RecruiterPage';
import CandidatePage from './pages/CandidatePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recruiter" element={<RecruiterPage />} />
          <Route path="/candidate" element={<CandidatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
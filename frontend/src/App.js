// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecruiterPage from './pages/RecruiterPage';
import CandidatePage from './pages/CandidatePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="logo">Accueil</Link> {/* Changez le titre ici */}
            <div className="nav-links">
              <Link to="/recruiter" className="nav-link">Recruiter</Link>
              <Link to="/candidate" className="nav-link">Candidate</Link>
            </div>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recruiter" element={<RecruiterPage />} />
            <Route path="/candidate" element={<CandidatePage />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <p>© {new Date().getFullYear()} AI Recruitment Platform</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

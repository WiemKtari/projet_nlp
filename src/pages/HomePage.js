// frontend/src/pages/HomePage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Make sure this CSS file exists

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Test connection to backend
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(data => {
        console.log('Backend connected:', data);
      })
      .catch(error => {
        console.error('Failed to connect to backend:', error);
      });
  }, []);

  return (
    <div className="home-page">
      <h1>Recruitment System</h1>
      <p>Welcome to the AI-powered recruitment platform</p>
      <div className="navigation">
        <button 
          className="btn" 
          onClick={() => navigate('/recruiter')}
        >
          Recruiter Portal
        </button>
        <button 
          className="btn" 
          onClick={() => navigate('/candidate')}
        >
          Candidate Portal
        </button>
      </div>
    </div>
  );
};

export default HomePage;

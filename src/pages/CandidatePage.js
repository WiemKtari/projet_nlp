import React, { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import Dashboard from '../components/Dashboard';
import ChatInterface from '../components/ChatInterface';
import axios from 'axios';  // Ajoutez ceci en haut de votre fichier

const CandidatePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentSession, setCurrentSession] = useState(null);

  const handleUploadSuccess = (data) => {
    console.log('Resume processed:', data);
    setActiveTab('dashboard');
  };

  const startInterview = async (jobId) => {
    try {
      // In a real app, you'd get the candidate ID from auth or session
      const candidateId = 'some-candidate-id';
      const response = await axios.get(
        `http://localhost:5000/api/chat/initiate/${candidateId}/${jobId}`
      );
      setCurrentSession(response.data);
      setActiveTab('interview');
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  return (
    <div className="candidate-page">
      <div className="tabs">
        <button onClick={() => setActiveTab('dashboard')}>Job Listings</button>
        <button onClick={() => setActiveTab('uploadResume')}>Upload Resume</button>
      </div>

      <div className="content">
        {activeTab === 'dashboard' && (
          <Dashboard userType="candidate" onStartInterview={startInterview} />
        )}
        {activeTab === 'uploadResume' && <ResumeUpload onUploadSuccess={handleUploadSuccess} />}
        {activeTab === 'interview' && currentSession && (
          <ChatInterface 
            sessionId={currentSession.session_id}
            initialQuestions={currentSession.questions}
          />
        )}
      </div>
    </div>
  );
};

export default CandidatePage;
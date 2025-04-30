import React, { useState } from 'react';
import JobPosting from '../components/JobPosting';
import ResumeUpload from '../components/ResumeUpload';
import Dashboard from '../components/Dashboard';
import ChatInterface from '../components/ChatInterface';
import axios from 'axios';  // Ajoutez ceci en haut de votre fichier

const RecruiterPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentSession, setCurrentSession] = useState(null);

  const handleJobPosted = (data) => {
    console.log('Job posted:', data);
    setActiveTab('dashboard');
  };

  const handleUploadSuccess = (data) => {
    console.log('Resume processed:', data);
  };

  const startInterview = async (candidateId, jobId) => {
    try {
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
    <div className="recruiter-page">
      <div className="tabs">
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('postJob')}>Post Job</button>
        <button onClick={() => setActiveTab('uploadResume')}>Upload Resume</button>
      </div>

      <div className="content">
        {activeTab === 'dashboard' && (
          <Dashboard userType="recruiter" onStartInterview={startInterview} />
        )}
        {activeTab === 'postJob' && <JobPosting onJobPosted={handleJobPosted} />}
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

export default RecruiterPage;
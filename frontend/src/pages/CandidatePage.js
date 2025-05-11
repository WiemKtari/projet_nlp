import React, { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import Dashboard from '../components/Dashboard';
import ChatInterface from '../components/ChatInterface';
import axios from 'axios';
import { motion } from 'framer-motion';
import './CandidatePage.css';  // Importation du CSS


const CandidatePage = () => {
  const [activeTab, setActiveTab] = useState('uploadResume'); // Défaut sur 'uploadResume'
  const [currentSession, setCurrentSession] = useState(null);

  const handleUploadSuccess = (data) => {
    console.log('Resume processed:', data);
    setActiveTab('dashboard');
  };

  const startInterview = async (jobId) => {
    try {
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
    <div className="candidate-page bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="tabs flex space-x-4 mb-8 border-b border-gray-200 pb-2">
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={`px-8 py-3 rounded-lg font-medium transition-all ${
    activeTab === 'dashboard'
      ? 'bg-purple-600 text-white shadow-lg transform hover:bg-purple-700'
      : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-purple-600'
  }`}
  onClick={() => setActiveTab('dashboard')}
>
  Job Listings
</motion.button>

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={`px-8 py-3 rounded-lg font-medium transition-all ${
    activeTab === 'uploadResume'
      ? 'bg-purple-600 text-white shadow-lg transform hover:bg-purple-700'
      : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-purple-600'
  }`}
  onClick={() => setActiveTab('uploadResume')}
>
  Upload Resume
</motion.button>

        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="content bg-white rounded-lg shadow-lg p-6"
        >
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
        </motion.div>
      </div>
    </div>
  );
};

export default CandidatePage;

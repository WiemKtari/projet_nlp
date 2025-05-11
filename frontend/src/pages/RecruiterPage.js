import React, { useState } from 'react';
import JobPosting from '../components/JobPosting';
import Dashboard from '../components/Dashboard';
import ChatInterface from '../components/ChatInterface';
import axios from 'axios';
import { motion } from 'framer-motion';

const RecruiterPage = () => {
  const [activeTab, setActiveTab] = useState('postJob'); // Par défaut, "postJob"
  const [currentSession, setCurrentSession] = useState(null);

  const handleJobPosted = (data) => {
    console.log('Job posted:', data);
    setActiveTab('dashboard');
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
    <div className="recruiter-page bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="tabs flex space-x-4 mb-8 border-b border-gray-200 pb-2">
          {['dashboard', 'postJob'].map((tab) => (  // Enlever 'uploadResume' ici
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-t-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'postJob' ? 'Post Job' : 'Dashboard'}
            </motion.button>
          ))}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="content bg-white rounded-lg shadow-lg p-6"
        >
          {activeTab === 'dashboard' && (
            <Dashboard userType="recruiter" onStartInterview={startInterview} />
          )}
          {activeTab === 'postJob' && <JobPosting onJobPosted={handleJobPosted} />}
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

export default RecruiterPage;

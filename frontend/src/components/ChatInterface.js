import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = ({ sessionId, initialQuestions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [responses, setResponses] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setCurrentQuestion(initialQuestions[0]);
    }
  }, [initialQuestions]);

  const handleAnswer = async () => {
    if (!selectedAnswer) return;

    setIsLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/chat/respond/${sessionId}`, {
        question_id: currentQuestion.id || currentQuestion.question,
        answer: selectedAnswer
      });

      const newResponses = [...responses, {
        question: currentQuestion.question,
        answer: selectedAnswer
      }];
      setResponses(newResponses);

      const response = await axios.get(`http://localhost:5000/api/chat/next/${sessionId}`);
      
      if (response.data.next_question) {
        setCurrentQuestion(response.data.next_question);
        setSelectedAnswer('');
      } else {
        setIsCompleted(true);
        setScore(response.data.evaluation.score);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="chat-container completed">
        <div className="chat-header">
          <h3>Interview Completed</h3>
          <div className="score-display">
            <div className="score-circle">
              <span>{score}%</span>
            </div>
            <p>Overall Score</p>
          </div>
        </div>
        
        <div className="responses-container">
          <h4>Interview Summary</h4>
          {responses.map((r, i) => (
            <div key={i} className="response-item">
              <div className="question-bubble">
                <p><strong>Q:</strong> {r.question}</p>
              </div>
              <div className="answer-bubble">
                <p><strong>A:</strong> {r.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Preparing questions...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Technical Interview</h3>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(responses.length / (responses.length + 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="question-container">
        <div className="question-bubble">
          <p>{currentQuestion.question}</p>
        </div>
      </div>
      
      <div className="options-container">
        {Object.entries(currentQuestion.suggested_answers).map(([key, value]) => (
          <div 
            key={key} 
            className={`option-card ${selectedAnswer === key ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer(key)}
          >
            <input
              type="radio"
              id={key}
              name="answer"
              value={key}
              checked={selectedAnswer === key}
              onChange={() => setSelectedAnswer(key)}
              hidden
            />
            <label htmlFor={key}>
              <span className="option-key">{key}</span>
              <span className="option-value">{value}</span>
            </label>
          </div>
        ))}
      </div>
      
      <button 
        className="submit-btn"
        onClick={handleAnswer} 
        disabled={!selectedAnswer || isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner-btn"></span> Processing...
          </>
        ) : 'Submit Answer'}
      </button>
    </div>
  );
};

export default ChatInterface;
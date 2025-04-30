import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatInterface = ({ sessionId, initialQuestions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [responses, setResponses] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setCurrentQuestion(initialQuestions[0]);
    }
  }, [initialQuestions]);

  const handleAnswer = async () => {
    if (!selectedAnswer) return;

    try {
      // Send response to server
      await axios.post(`http://localhost:5000/api/chat/respond/${sessionId}`, {
        question_id: currentQuestion.id || currentQuestion.question,
        answer: selectedAnswer
      });

      // Update local state
      const newResponses = [...responses, {
        question: currentQuestion.question,
        answer: selectedAnswer
      }];
      setResponses(newResponses);

      // Get next question
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
    }
  };

  if (isCompleted) {
    return (
      <div className="chat-completed">
        <h3>Interview Completed</h3>
        <p>Your score: {score}%</p>
        <div className="responses">
          <h4>Your Answers:</h4>
          {responses.map((r, i) => (
            <div key={i} className="response">
              <p><strong>Q:</strong> {r.question}</p>
              <p><strong>A:</strong> {r.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="chat-interface">
      <h3>Technical Interview</h3>
      <div className="question">
        <p>{currentQuestion.question}</p>
        <div className="options">
          {Object.entries(currentQuestion.suggested_answers).map(([key, value]) => (
            <div key={key} className="option">
              <input
                type="radio"
                id={key}
                name="answer"
                value={key}
                checked={selectedAnswer === key}
                onChange={() => setSelectedAnswer(key)}
              />
              <label htmlFor={key}>{key}: {value}</label>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleAnswer} disabled={!selectedAnswer}>
        Submit Answer
      </button>
    </div>
  );
};

export default ChatInterface;
import React, { useState } from 'react';
import axios from 'axios';

const JobPosting = ({ onJobPosted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Job description is required');
      return;
    }

    try {
      setIsPosting(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/jobs/post', {
        title,
        description
      });
      onJobPosted(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post job');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="job-posting">
      <h3>Post a New Job</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title:</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>
        <div>
          <label>Job Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter detailed job description and requirements..."
            rows={8}
          />
        </div>
        <button type="submit" disabled={isPosting}>
          {isPosting ? 'Posting...' : 'Post Job'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default JobPosting;
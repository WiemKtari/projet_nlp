import React, { useState } from 'react';
import axios from 'axios';
import './JobPosting.css';

const JobPosting = ({ onJobPosted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please upload a job description file');
      return;
    }

    const formData = new FormData();
    formData.append('jobFile', selectedFile);

    try {
      setIsPosting(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/jobs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onJobPosted(response.data);
      setSuccess(true);
      setSelectedFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload job file');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="job-posting-container">
      <div className="form-header">
        <h3>Upload Job Posting</h3>
        <p>Drag & drop a job description file or upload manually</p>
      </div>

      {success && <div className="success-message">Job posted successfully!</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form">
        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>{selectedFile ? selectedFile.name : 'Drag and drop a file here, or click to select a file'}</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isPosting}
        >
          {isPosting ? (
            <>
              <span className="spinner-btn"></span> Uploading...
            </>
          ) : 'Upload Job File'}
        </button>
      </form>
    </div>
  );
};

export default JobPosting;

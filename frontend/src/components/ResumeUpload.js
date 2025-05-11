import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './ResumeUpload.css';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const isValidFileType = (file) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="resume-upload-container">
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <div
          className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="file-preview">
              <div className="file-info">
                <span className="file-icon"></span>
                <p>{file.name}</p>
                <span className="file-size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                type="button"
                className="remove-btn"
                onClick={removeFile}
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon"></div>
              <p>Drag & drop your resume here</p>
              <p className="or-text">or</p>
              <label className="browse-btn">
                Browse Files
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  hidden
                />
              </label>
            </>
          )}
        </div>

        <button
          type="submit"
          className="upload-btn"
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <span className="spinner-btn"></span> Uploading...
            </>
          ) : 'Upload'}
        </button>
      </form>

      {result && (
        <div className={`result-container ${result.error ? 'error' : 'success'}`}>
          {result.error ? (
            <>
              <div className="result-icon error"></div>
              <p>Error: {result.error}</p>
            </>
          ) : (
            <>
              <div className="result-icon success"></div>
              <p>Processing successful!</p>
              <p>Extracted text sample:</p>
              <div className="content-box">
                <pre>{result.text}</pre>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;

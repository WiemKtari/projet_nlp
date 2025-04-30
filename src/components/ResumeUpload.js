import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept=".pdf,.doc,.docx" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button type="submit">Upload</button>
      </form>
      
      {result && (
        <div>
          {result.error ? (
            <p style={{ color: 'red' }}>Error: {result.error}</p>
          ) : (
            <div>
              <p>Processing successful!</p>
              <p>Extracted text sample:</p>
              <pre>{result.text}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
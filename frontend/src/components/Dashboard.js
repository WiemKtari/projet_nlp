import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ userType }) => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (userType === 'recruiter') {
          const jobsRes = await axios.get('http://localhost:5000/api/jobs');
          setJobs(jobsRes.data);
        } else {
          const candidatesRes = await axios.get('http://localhost:5000/api/candidates');
          setCandidates(candidatesRes.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userType]);

  const filteredItems = userType === 'recruiter' 
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : candidates.filter(candidate => 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
      ));

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading data...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-alert">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{userType === 'recruiter' ? 'Posted Jobs' : 'Available Positions'}</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Search ${userType === 'recruiter' ? 'jobs' : 'candidates'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">
            <i className="search-icon"></i>
          </button>
        </div>
      </div>
      
      <div className="cards-container">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item._id} className="card">
              {userType === 'recruiter' ? (
                <>
                  <h3>{item.title}</h3>
                  <p className="truncate">{item.description}</p>
                  <div className="card-footer">
                    <span className="badge">{item.applicants || 0} applicants</span>
                    <button className="card-btn">View Candidates</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="candidate-header">
                    <div className="avatar">{item.name.charAt(0)}</div>
                    <h3>{item.name}</h3>
                  </div>
                  <div className="skills-container">
                    {item.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                    {item.skills.length > 3 && (
                      <span className="skill-tag more">+{item.skills.length - 3} more</span>
                    )}
                  </div>
                  <button className="card-btn">View Profile</button>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No {userType === 'recruiter' ? 'jobs' : 'candidates'} found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
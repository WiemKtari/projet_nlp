import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ userType }) => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      {userType === 'recruiter' ? (
        <>
          <h2>Posted Jobs</h2>
          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.description.substring(0, 100)}...</p>
                <button>View Candidates</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2>Available Positions</h2>
          <div className="jobs-list">
            {candidates.map(candidate => (
              <div key={candidate._id} className="candidate-card">
                <h3>{candidate.name}</h3>
                <p>Skills: {candidate.skills.join(', ')}</p>
                <button>Apply</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
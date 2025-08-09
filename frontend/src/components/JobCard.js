import React, { useState } from 'react';
import axios from 'axios';

const JobCard = ({ job, onSuggestions }) => {
  const [loading, setLoading] = useState(false);

  const handleSuggestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/api/jobs/${job._id}/suggestions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuggestions(response.data, job);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      margin: '10px 0',
      background: 'white'
    }}>
      <h3>{job.role} @ {job.company}</h3>
      <p>Status: {job.status}</p>
      <p>Applied on: {new Date(job.appliedDate).toLocaleDateString()}</p>
      <p>Notes: {job.notes || 'N/A'}</p>
      <button 
        onClick={handleSuggestions}
        disabled={loading}
        style={{
          background: '#2196F3',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        {loading ? 'Loading...' : '💡 Resume Tips'}
      </button>
    </div>
  );
};

export default JobCard;

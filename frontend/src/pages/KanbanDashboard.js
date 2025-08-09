import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
import '../styles/KanbanDashboard.css';

const KanbanDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestions, setSelectedSuggestions] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { id: 'To Apply', title: 'To Apply', color: '#e3f2fd' },
    { id: 'Applied', title: 'Applied', color: '#fff3e0' },
    { id: 'Interview', title: 'Interview', color: '#f3e5f5' },
    { id: 'Results Announced', title: 'Results Announced', color: '#e8f5e8' }
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    // Optimistic update - update UI immediately
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job._id === jobId ? { ...job, status: newStatus } : job
      )
    );
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/jobs/${jobId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating job status:', error);
      // Revert on error
      fetchJobs();
    }
  };

  const handleSuggestions = (suggestions, job) => {
    setSelectedSuggestions(suggestions);
    setSelectedJob(job);
  };

  const getRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/jobs/recommendations/daily`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Please complete your profile first');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const getJobsByStatus = (status) => {
    return jobs.filter(job => job.status === status);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Job Application Tracker</h1>
          <p className="header-subtitle">Professional Career Management System</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          <button 
            className="btn btn-accent"
            onClick={getRecommendations}
            disabled={loadingRecommendations}
          >
            {loadingRecommendations ? 'Loading...' : 'Get Jobs'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/add-job')}
          >
            Add Job
          </button>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="kanban-board">
        <div className="table-columns">
          {columns.map(column => (
            <div 
              key={column.id} 
              className="kanban-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const jobId = e.dataTransfer.getData('jobId');
                if (jobId) {
                  updateJobStatus(jobId, column.id);
                }
              }}
            >
            <div className="column-header">
              <h3 className="column-title">{column.title}</h3>
              <span className="job-count">{getJobsByStatus(column.id).length}</span>
            </div>
            
            <div className="job-cards">
              {getJobsByStatus(column.id).map(job => (
                <div 
                  key={job._id} 
                  className="job-card"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('jobId', job._id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                >
                  <div className="job-card-header">
                    <h4 className="job-title">{job.role}</h4>
                    <div className="job-actions">
                      <button 
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                        className="action-btn"
                        title="Edit Job"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            const response = await axios.get(
                              `${API_BASE_URL}/api/jobs/${job._id}/suggestions`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            handleSuggestions(response.data, job);
                          } catch (error) {
                            console.error('Error getting suggestions:', error);
                          }
                        }}
                        className="action-btn"
                        title="Resume Tips"
                      >
                        💡
                      </button>
                      <button 
                        onClick={() => deleteJob(job._id)}
                        className="action-btn"
                        title="Delete Job"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className="job-company">{job.company}</p>
                  <p className="job-date">
                    {new Date(job.appliedDate).toLocaleDateString()}
                  </p>
                  
                  {job.notes && (
                    <p className="job-notes">{job.notes.substring(0, 100)}...</p>
                  )}
                  
                  {job.jobUrl && (
                    <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="job-url">
                      🔗 View Job
                    </a>
                  )}
                  
                  <select 
                    value={job.status} 
                    onChange={(e) => updateJobStatus(job._id, e.target.value)}
                    className="status-select"
                  >
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedSuggestions && selectedJob && (
        <div 
          className="modal-overlay suggestions-modal"
          onClick={(e) => {
            if (e.target.className.includes('modal-overlay')) {
              setSelectedSuggestions(null);
              setSelectedJob(null);
            }
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">💡 Resume Tips for {selectedJob.role}</h2>
              <button 
                onClick={() => {
                  setSelectedSuggestions(null);
                  setSelectedJob(null);
                }}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="suggestions-grid">
                <div className="job-info">
                  <p><strong>Company:</strong> {selectedJob.company}</p>
                  <p><strong>Salary Range:</strong> {selectedSuggestions.salaryRange || 'Not available'}</p>
                  <p><strong>Experience Level:</strong> {selectedSuggestions.experienceLevel || 'Not assessed'}</p>
                </div>
              
                {selectedSuggestions.technicalSkills?.length > 0 && (
                  <div className="suggestion-section">
                    <h4 className="suggestion-title">⚙️ Missing Technical Skills</h4>
                    <ul className="suggestion-list">
                      {selectedSuggestions.technicalSkills.map((skill, index) => (
                        <li key={index} className="suggestion-item">{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
              
                {selectedSuggestions.toolsFrameworks?.length > 0 && (
                  <div className="suggestion-section">
                    <h4 className="suggestion-title">🔧 Tools & Frameworks</h4>
                    <ul className="suggestion-list">
                      {selectedSuggestions.toolsFrameworks.map((tool, index) => (
                        <li key={index} className="suggestion-item">{tool}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedSuggestions.architecturalPatterns?.length > 0 && (
                  <div className="suggestion-section">
                    <h4 className="suggestion-title">🏗️ Architecture & Patterns</h4>
                    <ul className="suggestion-list">
                      {selectedSuggestions.architecturalPatterns.map((pattern, index) => (
                        <li key={index} className="suggestion-item">{pattern}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedSuggestions.projectSuggestions?.length > 0 && (
                  <div className="suggestion-section">
                    <h4 className="suggestion-title">🚀 Recommended Projects</h4>
                    <ul className="suggestion-list">
                      {selectedSuggestions.projectSuggestions.map((project, index) => (
                        <li key={index} className="suggestion-item">{project}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedSuggestions.certifications?.length > 0 && (
                  <div className="suggestion-section">
                    <h4 className="suggestion-title">🏅 Strategic Certifications</h4>
                    <div className="cert-links">
                      {selectedSuggestions.certifications.map((cert, index) => (
                        <a 
                          key={index} 
                          href={cert.link || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="cert-link"
                        >
                          {cert.name || cert}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedSuggestions.strengthsMatch?.length > 0 && (
                  <div className="suggestion-section">
                    <h4 className="suggestion-title">✅ Your Technical Strengths</h4>
                    <ul className="suggestion-list">
                      {selectedSuggestions.strengthsMatch.map((strength, index) => (
                        <li key={index} className="suggestion-item">{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {recommendations && (
        <div 
          className="modal-overlay recommendations-modal"
          onClick={(e) => {
            if (e.target.className.includes('modal-overlay')) {
              setRecommendations(null);
            }
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">🎯 Daily Job Recommendations</h2>
              <button 
                onClick={() => setRecommendations(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="recommendations-grid">
                {recommendations.map((job, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="rec-header">
                      <h4 className="rec-title">{job.role}</h4>
                      <span className="posted-badge">{job.postedDays} days ago</span>
                    </div>
                    <p className="rec-company">{job.company} - {job.location}</p>
                    <p className="rec-details">{job.experience} | {job.salary}</p>
                    <div className="rec-skills">
                      {job.skills?.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="rec-actions">
                      <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="job-link">
                        🔗 View Job
                      </a>
                      <button 
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            await axios.post(
                              `${API_BASE_URL}/api/jobs`,
                              {
                                company: job.company,
                                role: job.role,
                                status: 'To Apply',
                                notes: `Skills: ${job.skills?.join(', ')} | Salary: ${job.salary} | Experience: ${job.experience}`,
                                jobUrl: job.jobUrl
                              },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            fetchJobs();
                            alert('Job added to tracker!');
                          } catch (error) {
                            console.error('Error adding job:', error);
                            alert('Failed to add job');
                          }
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        ➕ Add to Tracker
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanDashboard;
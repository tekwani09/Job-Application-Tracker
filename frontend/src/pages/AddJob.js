import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
import '../styles/AddJob.css';


const AddJob = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('To Apply');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeSuggestions, setResumeSuggestions] = useState(null);

  const navigate = useNavigate();

  const handleUrlExtract = async () => {
    if (!jobUrl) return;
    
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/jobs/extract-url`,
        { jobUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('URL Extract Response:', response.data);
      
      // Fill form fields with extracted data
      const job = response.data.job;
      setCompany(job.company || '');
      setRole(job.role || '');
      setNotes(job.notes || '');
      setStatus(job.status || 'To Apply');
      
      // Show suggestions if available
      if (response.data.resumeSuggestions) {
        setResumeSuggestions(response.data.resumeSuggestions);
      }
    } catch (err) {
      setError('Failed to extract job details from URL');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
`${API_BASE_URL}/api/jobs`,
        { company, role, status, appliedDate, notes, jobUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Response data:', response.data);
      
      // Always show suggestions if they exist, even empty ones
      setResumeSuggestions(response.data.resumeSuggestions || { test: 'No suggestions' });
      
      // Don't auto-navigate, let user see suggestions
      // navigate('/dashboard');
    } catch (err) {
      setError('Failed to add job');
      console.error(err);
    }
  };

  return (
    <div className="job-form-page">
      <form className="job-form" onSubmit={handleSubmit}>
      <h2>➕ Add New Job</h2>
        
        <div className="url-section">
          <label>Job URL (Auto-extract details):</label>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://company.com/job-posting"
          />
          <button 
            type="button" 
            onClick={handleUrlExtract}
            disabled={!jobUrl || loading}
            style={{ marginTop: '10px', padding: '8px 16px' }}
          >
            {loading ? 'Extracting...' : 'Extract'}
          </button>
        </div>
        
        <div style={{ textAlign: 'center', margin: '20px 0', color: '#666' }}>
          OR fill manually:
        </div>
        
        <div>
          <label>Company:</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="To Apply">To Apply</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Results Announced">Results Announced</option>
          </select>
        </div>
        <div>
          <label>Applied Date:</label>
          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
          />
        </div>
        <div>
          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          />
        </div>
        <button type="submit">Add Job</button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      </form>
      
      {resumeSuggestions && (
        <div className="technical-analysis">
          <div className="analysis-header">
            <h2>📊 Technical Resume Analysis</h2>
            <div className="salary-badge">
              <span className="salary-label">Estimated Salary:</span>
              <span className="salary-value">{resumeSuggestions.salaryRangeINR || 'Not available'}</span>
            </div>
            <div className="experience-badge">
              <span className="exp-label">Level:</span>
              <span className="exp-value">{resumeSuggestions.experienceLevel || 'Not assessed'}</span>
            </div>
          </div>

          <div className="analysis-grid">
            {resumeSuggestions.technicalSkills?.length > 0 && (
              <div className="analysis-card technical">
                <h3>⚙️ Missing Technical Skills</h3>
                <div className="skill-tags">
                  {resumeSuggestions.technicalSkills.map((skill, index) => (
                    <span key={index} className="skill-tag critical">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {resumeSuggestions.toolsFrameworks?.length > 0 && (
              <div className="analysis-card tools">
                <h3>🔧 Tools & Frameworks</h3>
                <div className="skill-tags">
                  {resumeSuggestions.toolsFrameworks.map((tool, index) => (
                    <span key={index} className="skill-tag warning">{tool}</span>
                  ))}
                </div>
              </div>
            )}

            {resumeSuggestions.architecturalPatterns?.length > 0 && (
              <div className="analysis-card architecture">
                <h3>🏧 Architecture & Patterns</h3>
                <ul className="insight-list">
                  {resumeSuggestions.architecturalPatterns.map((pattern, index) => (
                    <li key={index}>{pattern}</li>
                  ))}
                </ul>
              </div>
            )}

            {resumeSuggestions.projectSuggestions?.length > 0 && (
              <div className="analysis-card projects">
                <h3>🚀 Recommended Projects</h3>
                <ul className="project-list">
                  {resumeSuggestions.projectSuggestions.map((project, index) => (
                    <li key={index} className="project-item">{project}</li>
                  ))}
                </ul>
              </div>
            )}

            {resumeSuggestions.certifications?.length > 0 && (
              <div className="analysis-card certifications">
                <h3>🏅 Strategic Certifications</h3>
                <div className="cert-links">
                  {resumeSuggestions.certifications.map((cert, index) => (
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

            {resumeSuggestions.strengthsMatch?.length > 0 && (
              <div className="analysis-card strengths">
                <h3>✅ Your Technical Strengths</h3>
                <ul className="strength-list">
                  {resumeSuggestions.strengthsMatch.map((strength, index) => (
                    <li key={index} className="strength-item">{strength}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="action-footer">
            <button 
              onClick={() => navigate('/dashboard')}
              className="dashboard-btn"
            >
              📋 Go to Dashboard
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="profile-btn"
            >
              👤 Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddJob;

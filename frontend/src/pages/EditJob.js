import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditJob.css';


const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [resumeSuggestions, setResumeSuggestions] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const job = res.data;
        setCompany(job.company);
        setRole(job.role);
        setStatus(job.status);
        setAppliedDate(job.appliedDate?.slice(0, 10));
        setNotes(job.notes);
      } catch (err) {
        console.error('❌ Error fetching job:', err.response?.data || err.message);
        alert('Failed to fetch job');
      }
    };

    fetchJob();
  }, [id]);

 const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem('token');

    const response = await axios.put(
      `${API_BASE_URL}/api/jobs/${id}`,
      { company, role, status, appliedDate, notes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.resumeSuggestions) {
      setResumeSuggestions(response.data.resumeSuggestions);
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    console.error('❌ Update failed:', err.response?.data || err.message);
    alert('Failed to update job');
  }
};

  return (
    <div className="job-form-page">
      <form className="job-form" onSubmit={handleUpdate}>
      <h2>✏️ Edit Job</h2>
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

        <button type="submit">Update Job</button>
      </form>
      
      {resumeSuggestions && (
        <div className="resume-suggestions">
          <h3>📝 Resume Suggestions for Updated Job</h3>
          
          {resumeSuggestions.missingSkills?.length > 0 && (
            <div className="suggestion-section">
              <h4>🔧 Skills to Add:</h4>
              <ul>
                {resumeSuggestions.missingSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          
          {resumeSuggestions.keywordsToadd?.length > 0 && (
            <div className="suggestion-section">
              <h4>🔑 Keywords to Include:</h4>
              <ul>
                {resumeSuggestions.keywordsToadd.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
          )}
          
          {resumeSuggestions.suggestedProjects?.length > 0 && (
            <div className="suggestion-section">
              <h4>📊 Projects to Add:</h4>
              <ul>
                {resumeSuggestions.suggestedProjects.map((project, index) => (
                  <li key={index}>{project}</li>
                ))}
              </ul>
            </div>
          )}
          
          {resumeSuggestions.certifications?.length > 0 && (
            <div className="suggestion-section">
              <h4>🏅 Certifications to Consider:</h4>
              <ul>
                {resumeSuggestions.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
          
          {resumeSuggestions.experienceGaps?.length > 0 && (
            <div className="suggestion-section">
              <h4>💼 Experience Gaps to Address:</h4>
              <ul>
                {resumeSuggestions.experienceGaps.map((gap, index) => (
                  <li key={index}>{gap}</li>
                ))}
              </ul>
            </div>
          )}
          
          {resumeSuggestions.matchingStrengths?.length > 0 && (
            <div className="suggestion-section">
              <h4>✅ Your Matching Strengths:</h4>
              <ul>
                {resumeSuggestions.matchingStrengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="continue-btn"
          >
            Continue to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default EditJob;

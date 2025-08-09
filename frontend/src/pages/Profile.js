import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    skills: [],
    experience: 0,
    location: '',
    preferredRoles: [],
    education: '',
    resume: '',
    portfolio: '',
    linkedin: '',
    github: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.profile) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/profile`,
        { profile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skill)
    });
  };

  const addRole = () => {
    if (roleInput.trim() && !profile.preferredRoles.includes(roleInput.trim())) {
      setProfile({
        ...profile,
        preferredRoles: [...profile.preferredRoles, roleInput.trim()]
      });
      setRoleInput('');
    }
  };

  const removeRole = (role) => {
    setProfile({
      ...profile,
      preferredRoles: profile.preferredRoles.filter(r => r !== role)
    });
  };

  const parseResume = async () => {
    if (!resumeText.trim()) {
      alert('Please paste your resume text first');
      return;
    }

    setParsing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/profile/parse-resume`,
        { resumeText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const parsedData = response.data;
      setProfile({
        ...profile,
        ...parsedData,
        skills: parsedData.skills || [],
        preferredRoles: parsedData.preferredRoles || []
      });
      
      alert('Resume parsed successfully! Review and update the fields as needed.');
    } catch (error) {
      console.error('Error parsing resume:', error);
      alert('Failed to parse resume. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const parseResumeFile = async () => {
    if (!selectedFile) {
      alert('Please select a resume file first');
      return;
    }

    setParsing(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/profile/parse-resume-file`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      const parsedData = response.data;
      setProfile({
        ...profile,
        ...parsedData,
        skills: parsedData.skills || [],
        preferredRoles: parsedData.preferredRoles || []
      });
      
      alert('Resume file parsed successfully! Review and update the fields as needed.');
    } catch (error) {
      console.error('Error parsing resume file:', error);
      alert('Failed to parse resume file. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>👤 Complete Your Profile</h2>
        
        <div className="resume-parser">
          <h3>📄 Auto-fill from Resume</h3>
          
          <div className="upload-section">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="file-input"
              id="resume-file"
            />
            <label htmlFor="resume-file" className="file-label">
              {selectedFile ? selectedFile.name : 'Choose Resume File (PDF, DOC, DOCX, TXT)'}
            </label>
            <button 
              type="button" 
              onClick={parseResumeFile}
              disabled={parsing || !selectedFile}
              className="parse-btn"
            >
              {parsing ? 'Parsing...' : '📄 Parse File'}
            </button>
          </div>
          
          <div className="text-divider">OR</div>
          
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here to auto-fill the profile fields..."
            rows="4"
            className="resume-textarea"
          />
          <button 
            type="button" 
            onClick={parseResume}
            disabled={parsing || !resumeText.trim()}
            className="parse-btn"
          >
            {parsing ? 'Parsing...' : '📝 Parse Text'}
          </button>
        </div>
        
        <div className="divider">OR fill manually:</div>
        
        <div className="form-group">
          <label>Skills</label>
          <div className="skill-input">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button type="button" onClick={addSkill}>Add</button>
          </div>
          <div className="tags">
            {profile.skills.map(skill => (
              <span key={skill} className="tag">
                {skill} <button type="button" onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Experience (years)</label>
          <input
            type="number"
            value={profile.experience}
            onChange={(e) => setProfile({...profile, experience: parseInt(e.target.value) || 0})}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({...profile, location: e.target.value})}
            placeholder="City, Country"
          />
        </div>

        <div className="form-group">
          <label>Preferred Roles</label>
          <div className="skill-input">
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="Add preferred role"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
            />
            <button type="button" onClick={addRole}>Add</button>
          </div>
          <div className="tags">
            {profile.preferredRoles.map(role => (
              <span key={role} className="tag">
                {role} <button type="button" onClick={() => removeRole(role)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Education</label>
          <input
            type="text"
            value={profile.education}
            onChange={(e) => setProfile({...profile, education: e.target.value})}
            placeholder="Degree, University"
          />
        </div>

        <div className="form-group">
          <label>Resume URL</label>
          <input
            type="url"
            value={profile.resume}
            onChange={(e) => setProfile({...profile, resume: e.target.value})}
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div className="form-group">
          <label>Portfolio URL</label>
          <input
            type="url"
            value={profile.portfolio}
            onChange={(e) => setProfile({...profile, portfolio: e.target.value})}
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div className="form-group">
          <label>LinkedIn URL</label>
          <input
            type="url"
            value={profile.linkedin}
            onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="form-group">
          <label>GitHub URL</label>
          <input
            type="url"
            value={profile.github}
            onChange={(e) => setProfile({...profile, github: e.target.value})}
            placeholder="https://github.com/username"
          />
        </div>

        <button type="submit" disabled={loading} className="save-btn">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
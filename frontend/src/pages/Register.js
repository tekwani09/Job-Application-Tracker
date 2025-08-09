import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Briefcase, Target, TrendingUp } from 'lucide-react';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await API.post(`http://localhost:8080/api/auth/register`, formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Briefcase size={24} />, text: 'Organize all your job applications' },
    { icon: <Target size={24} />, text: 'Track application status and progress' },
    { icon: <TrendingUp size={24} />, text: 'Get insights and recommendations' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '1400px',
        width: '95%',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f3f4f6',
        overflow: 'hidden',
        minHeight: '700px'
      }}>
        {/* Left Panel - Features */}
        <div style={{
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          color: '#ffffff',
          padding: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '48px',
            borderRadius: '16px',
            color: '#1f2937',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f3f4f6',
            textAlign: 'left',
            position: 'relative',
            zIndex: 2
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '16px',
              lineHeight: '1.2',
              color: '#1f2937'
            }}>
              Job Application Tracker
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Stay organized. Track applications. Land your dream job.
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {features.map((feature, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '1rem',
                  color: '#4b5563'
                }}>
                  <span style={{
                    width: '48px',
                    height: '48px',
                    background: '#f3f4f6',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280'
                  }}>
                    {feature.icon}
                  </span>
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel - Register Form */}
        <div style={{
          padding: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                Create Account
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                margin: 0
              }}>
                Get started with your free account today
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusedField === 'name' ? '#6b7280' : '#9ca3af',
                  transition: 'color 0.2s ease',
                  zIndex: 2
                }}>
                  <User size={20} />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  required
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 52px',
                    border: `2px solid ${focusedField === 'name' ? '#6b7280' : '#f1f3f4'}`,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: focusedField === 'name' ? '#ffffff' : '#fafbfc',
                    outline: 'none',
                    boxShadow: focusedField === 'name' ? '0 0 0 4px rgba(107, 114, 128, 0.08)' : 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusedField === 'email' ? '#6b7280' : '#9ca3af',
                  transition: 'color 0.2s ease',
                  zIndex: 2
                }}>
                  <Mail size={20} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 52px',
                    border: `2px solid ${focusedField === 'email' ? '#6b7280' : '#f1f3f4'}`,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: focusedField === 'email' ? '#ffffff' : '#fafbfc',
                    outline: 'none',
                    boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(107, 114, 128, 0.08)' : 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '32px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusedField === 'password' ? '#6b7280' : '#9ca3af',
                  transition: 'color 0.2s ease',
                  zIndex: 2
                }}>
                  <Lock size={20} />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  required
                  style={{
                    width: '100%',
                    padding: '16px 52px 16px 52px',
                    border: `2px solid ${focusedField === 'password' ? '#6b7280' : '#f1f3f4'}`,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: focusedField === 'password' ? '#ffffff' : '#fafbfc',
                    outline: 'none',
                    boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(107, 114, 128, 0.08)' : 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isLoading 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isLoading ? 'none' : '0 4px 15px rgba(107, 114, 128, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.2)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #ffffff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Login Link */}
              <p style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.95rem',
                margin: 0
              }}>
                Already have an account?{' '}
                <a
                  href="/login"
                  style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontWeight: '600',
                    borderBottom: '1px solid transparent',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.borderBottomColor = '#6b7280'}
                  onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          
          .auth-left {
            display: none !important;
          }
          
          .auth-right {
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;

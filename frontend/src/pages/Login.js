import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, CheckCircle, ArrowRight, Briefcase, Target, TrendingUp } from 'lucide-react';
import API from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
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
      padding: '24px',
      position: 'relative'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 30% 20%, rgba(107, 114, 128, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

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
        minHeight: '700px',
        position: 'relative'
      }}>


        {/* Left Panel - Product Info */}
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
          {/* Decorative background pattern */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            animation: 'float 20s ease-in-out infinite',
            transform: 'rotate(15deg)'
          }} />

          <div style={{
            textAlign: 'left',
            background: '#ffffff',
            padding: '48px',
            borderRadius: '16px',
            color: '#1f2937',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f3f4f6',
            position: 'relative',
            zIndex: 2,
            backdropFilter: 'blur(10px)'
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
              margin: 0
            }}>
              {features.map((feature, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  fontSize: '0.95rem',
                  color: '#4b5563',
                  transform: 'translateX(0)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }} 
                onMouseEnter={(e) => e.target.style.transform = 'translateX(8px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}>
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

        {/* Right Panel - Login Form */}
        <div style={{
          padding: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                Welcome Back
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                margin: 0
              }}>
                Sign in to continue your career journey
              </p>
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
                placeholder="Enter your password"
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

            {/* Login Button */}
            <button
              onClick={handleSubmit}
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
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transform: isLoading ? 'none' : 'translateY(0)',
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <p style={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.95rem',
              margin: 0
            }}>
              Don't have an account?{' '}
              <a
                href="/register"
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
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: rotate(15deg) translateY(0px); }
          50% { transform: rotate(15deg) translateY(-10px); }
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

export default Login;
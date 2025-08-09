import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Briefcase size={32} />,
      title: 'Application Tracking',
      description: 'Keep track of all your job applications in one organized dashboard'
    },
    {
      icon: <Target size={32} />,
      title: 'Smart Recommendations',
      description: 'Get personalized job recommendations based on your profile and preferences'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Progress Analytics',
      description: 'Monitor your application success rate and identify improvement areas'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Status Management',
      description: 'Organize applications by status: Applied, Interview, Offer, Rejected'
    },
    {
      icon: <Zap size={32} />,
      title: 'AI-Powered Tips',
      description: 'Receive intelligent suggestions to improve your resume and applications'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure with enterprise-grade protection'
    }
  ];



  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%)'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 0',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #f3f4f6',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Briefcase size={32} color="#6b7280" />
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              Job Tracker
            </h1>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '8px 20px',
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '100px 24px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          color: '#1f2937',
          marginBottom: '24px',
          lineHeight: '1.1'
        }}>
          Job Application Tracker
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '48px',
          maxWidth: '600px',
          margin: '0 auto 48px auto',
          lineHeight: '1.6'
        }}>
          Stay organized. Track applications. Land your dream job.
        </p>
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Start Free Trial
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '16px 32px',
              background: '#ffffff',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.background = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.background = '#ffffff';
            }}
          >
            Sign In
          </button>
        </div>
      </section>



      {/* Features Section */}
      <section style={{
        padding: '100px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Everything You Need
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Powerful features designed to streamline your job search and maximize your success rate.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: '#ffffff',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: '#f3f4f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                color: '#6b7280'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Ready to Transform Your Job Search?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '48px',
            opacity: 0.9
          }}>
            Join thousands of professionals who have streamlined their career journey with our platform.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '16px 32px',
              background: '#ffffff',
              color: '#6b7280',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Get Started Now
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        background: '#ffffff',
        borderTop: '1px solid #f3f4f6',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <Briefcase size={24} color="#6b7280" />
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Job Application Tracker
            </span>
          </div>
          <p style={{
            color: '#6b7280',
            fontSize: '0.95rem',
            margin: 0
          }}>
            © 2024 Job Application Tracker. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem !important;
          }
          
          .hero-buttons {
            flex-direction: column !important;
            align-items: center !important;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
          
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
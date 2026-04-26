import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful! Redirecting...');
      setError('');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setMessage('');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)'
    }}>
      {/* Left Side - Decorative */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
        padding: '60px', color: 'white'
      }} className="hide-mobile">
        <span style={{fontSize: '80px', marginBottom: '24px'}}>💄</span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '40px', fontWeight: '700',
          marginBottom: '16px', textAlign: 'center'
        }}>
          Welcome Back!
        </h2>
        <p style={{
          fontSize: '18px', opacity: 0.85,
          textAlign: 'center', lineHeight: '1.6',
          maxWidth: '300px'
        }}>
          Your perfect beauty experience is just one login away.
        </p>
        <div style={{marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {['✨ 500+ Happy Customers', '💅 Top Rated Salons', '📅 Easy Booking'].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '12px 24px', borderRadius: '12px',
              fontSize: '15px', fontWeight: '500'
            }}>{item}</div>
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px'
      }}>
        <div style={{width: '100%', maxWidth: '420px'}}>
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <span style={{fontSize: '40px'}}>👋</span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px', color: '#1f2937',
              marginTop: '8px', marginBottom: '8px'
            }}>Sign In</h2>
            <p style={{color: '#6b7280'}}>Enter your credentials to continue</p>
          </div>

          {message && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #86efac',
              color: '#16a34a', padding: '12px 16px',
              borderRadius: '12px', marginBottom: '20px',
              textAlign: 'center', fontWeight: '500'
            }}>{message}</div>
          )}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fca5a5',
              color: '#dc2626', padding: '12px 16px',
              borderRadius: '12px', marginBottom: '20px',
              textAlign: 'center', fontWeight: '500'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'block', marginBottom: '8px',
                fontWeight: '600', color: '#374151', fontSize: '14px'
              }}>Email Address</label>
              <input
                type="email" name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange} required
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '2px solid #fce7f3', borderRadius: '12px',
                  fontSize: '15px', outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box',
                  fontFamily: "'Inter', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = '#db2777'}
                onBlur={e => e.target.style.borderColor = '#fce7f3'}
              />
            </div>

            <div style={{marginBottom: '28px'}}>
              <label style={{
                display: 'block', marginBottom: '8px',
                fontWeight: '600', color: '#374151', fontSize: '14px'
              }}>Password</label>
              <input
                type="password" name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange} required
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '2px solid #fce7f3', borderRadius: '12px',
                  fontSize: '15px', outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box',
                  fontFamily: "'Inter', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = '#db2777'}
                onBlur={e => e.target.style.borderColor = '#fce7f3'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #db2777, #9d174d)',
                color: 'white', border: 'none',
                borderRadius: '12px', fontSize: '16px',
                fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 4px 15px rgba(219,39,119,0.4)',
                transition: 'all 0.3s'
              }}
            >
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{textAlign: 'center', marginTop: '24px', color: '#6b7280', fontSize: '15px'}}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{color: '#db2777', cursor: 'pointer', fontWeight: '700'}}
            >
              Create one free
            </span>
          </p>

          <p style={{textAlign: 'center', marginTop: '12px'}}>
            <span
              onClick={() => navigate('/')}
              style={{color: '#9ca3af', cursor: 'pointer', fontSize: '14px'}}
            >
              ← Back to Home
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
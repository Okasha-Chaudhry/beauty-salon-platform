import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer'
  });
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
      const res = await registerUser(formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setMessage('Account created successfully! Redirecting...');
      setError('');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setMessage('');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)'
    }}>
      {/* Left Side - Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        width: '100%'
      }}>
        <div style={{width: '100%', maxWidth: '420px'}}>
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <span style={{fontSize: '40px'}}>✨</span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px', color: '#1f2937',
              marginTop: '8px', marginBottom: '8px'
            }}>Create Account</h2>
            <p style={{color: '#6b7280'}}>Join thousands of beauty lovers</p>
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
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Okasha Chaudhry' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Min 8 characters' },
            ].map((field, i) => (
              <div key={i} style={{marginBottom: '20px'}}>
                <label style={{
                  display: 'block', marginBottom: '8px',
                  fontWeight: '600', color: '#374151', fontSize: '14px'
                }}>{field.label}</label>
                <input
                  type={field.type} name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange} required
                  style={{
                    width: '100%', padding: '14px 16px',
                    border: '2px solid #fce7f3', borderRadius: '12px',
                    fontSize: '15px', outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onFocus={e => e.target.style.borderColor = '#db2777'}
                  onBlur={e => e.target.style.borderColor = '#fce7f3'}
                />
              </div>
            ))}

            <div style={{marginBottom: '28px'}}>
              <label style={{
                display: 'block', marginBottom: '8px',
                fontWeight: '600', color: '#374151', fontSize: '14px'
              }}>I am a</label>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                {[
                  { value: 'customer', label: '👤 Customer', desc: 'Book appointments' },
                  { value: 'salon_owner', label: '💄 Salon Owner', desc: 'List my salon' },
                ].map((option, i) => (
                  <div key={i}
                    onClick={() => setFormData({...formData, role: option.value})}
                    style={{
                      padding: '16px', borderRadius: '12px',
                      border: '2px solid',
                      borderColor: formData.role === option.value ? '#db2777' : '#fce7f3',
                      background: formData.role === option.value ? '#fdf2f8' : 'white',
                      cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.3s'
                    }}
                  >
                    <p style={{fontWeight: '700', color: formData.role === option.value ? '#db2777' : '#374151'}}>{option.label}</p>
                    <p style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #db2777, #9d174d)',
              color: 'white', border: 'none',
              borderRadius: '12px', fontSize: '16px',
              fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 15px rgba(219,39,119,0.4)'
            }}>
              {loading ? '⏳ Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{textAlign: 'center', marginTop: '24px', color: '#6b7280', fontSize: '15px'}}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}
              style={{color: '#db2777', cursor: 'pointer', fontWeight: '700'}}>
              Sign in
            </span>
          </p>
          <p style={{textAlign: 'center', marginTop: '12px'}}>
            <span onClick={() => navigate('/')}
              style={{color: '#9ca3af', cursor: 'pointer', fontSize: '14px'}}>
              ← Back to Home
            </span>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative - Hidden on mobile */}
      <div className="hide-mobile" style={{
        flex: 1,
        background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px', color: 'white'
      }}>
        <span style={{fontSize: '80px', marginBottom: '24px'}}>💅</span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '40px', fontWeight: '700',
          marginBottom: '16px', textAlign: 'center'
        }}>Join GlamourFind</h2>
        <p style={{
          fontSize: '18px', opacity: 0.85,
          textAlign: 'center', lineHeight: '1.6',
          maxWidth: '300px'
        }}>
          Discover and book the best beauty salons in your city.
        </p>
        <div style={{marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '280px'}}>
          {[
            { icon: '🔒', text: 'Secure & Private' },
            { icon: '⚡', text: 'Instant Booking' },
            { icon: '⭐', text: 'Verified Reviews' },
            { icon: '💰', text: 'Best Prices' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.15)',
              padding: '12px 20px', borderRadius: '12px',
              fontSize: '15px', fontWeight: '500'
            }}>
              <span style={{fontSize: '20px'}}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;
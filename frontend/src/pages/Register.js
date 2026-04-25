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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
     localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
     setMessage(res.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setMessage('');
    }
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#fdf2f8'}}>
      <div style={{backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px'}}>
        <h2 style={{color: '#db2777', textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '24px'}}>
          💄 Create Account
        </h2>

        {message && <p style={{color: 'green', textAlign: 'center', marginBottom: '16px'}}>{message}</p>}
        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '16px'}}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'}}
            >
              <option value="customer">Customer</option>
              <option value="salon_owner">Salon Owner</option>
            </select>
          </div>

          <button
            type="submit"
            style={{width: '100%', padding: '12px', backgroundColor: '#db2777', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'}}
          >
            Create Account
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '16px', color: 'gray'}}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{color: '#db2777', cursor: 'pointer', fontWeight: '600'}}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
      padding: '0 32px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(219, 39, 119, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}}
      >
        <span style={{fontSize: '28px'}}>💄</span>
        <div>
          <span style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '700',
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '0.5px'
          }}>
            GlamourFind
          </span>
          <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '10px', marginTop: '-2px'}}>
            Beauty at your fingertips
          </p>
        </div>
      </div>

      {/* Desktop Nav */}
      <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
        <span
          onClick={() => navigate('/')}
          style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px', opacity: 0.9}}
        >
          Home
        </span>
        {user ? (
          <>
            <span
              onClick={() => navigate('/my-bookings')}
              style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px', opacity: 0.9}}
            >
              My Bookings
            </span>
            {user.role === 'admin' && (
              <span
                onClick={() => navigate('/admin')}
                style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px', opacity: 0.9}}
              >
                🛠️ Admin
              </span>
            )}
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{
                width: '38px', height: '38px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '16px',
                cursor: 'pointer'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{color: 'white', fontWeight: '500'}}>{user.name}</span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '8px 18px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <span
              onClick={() => navigate('/login')}
              style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px', opacity: 0.9}}
            >
              Login
            </span>
            <button
              onClick={() => navigate('/register')}
              style={{
                backgroundColor: 'white',
                color: '#db2777',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
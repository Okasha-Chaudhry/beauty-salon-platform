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
      padding: '0 24px',
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
      <div onClick={() => navigate('/')} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}}>
        <span style={{fontSize: '28px'}}>💄</span>
        <div>
          <span style={{color: 'white', fontSize: '20px', fontWeight: '700', fontFamily: "'Playfair Display', serif"}}>
            GlamourFind
          </span>
          <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '10px', marginTop: '-2px'}}>Beauty at your fingertips</p>
        </div>
      </div>

      {/* Hamburger Button - Mobile Only */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          flexDirection: 'column',
          gap: '5px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px'
        }}
      >
        <span style={{width: '25px', height: '3px', background: 'white', borderRadius: '3px', display: 'block', transition: 'all 0.3s'}}/>
        <span style={{width: '25px', height: '3px', background: 'white', borderRadius: '3px', display: 'block', transition: 'all 0.3s'}}/>
        <span style={{width: '25px', height: '3px', background: 'white', borderRadius: '3px', display: 'block', transition: 'all 0.3s'}}/>
      </button>

      {/* Desktop + Mobile Menu */}
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <span onClick={() => { navigate('/'); setMenuOpen(false); }}
          style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px'}}>
          Home
        </span>

        {user ? (
          <>
            <span onClick={() => { navigate('/my-bookings'); setMenuOpen(false); }}
              style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px'}}>
              My Bookings
            </span>

            {user.role === 'salon_owner' && (
              <span onClick={() => { navigate('/owner-dashboard'); setMenuOpen(false); }}
                style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px'}}>
                💄 My Salon
              </span>
            )}

            {user.role === 'admin' && (
              <span onClick={() => { navigate('/admin'); setMenuOpen(false); }}
                style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px'}}>
                🛠️ Admin
              </span>
            )}

            <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '16px'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{color: 'white', fontWeight: '500', fontSize: '14px'}}>{user.name}</span>
              <button onClick={handleLogout} style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px', borderRadius: '25px',
                cursor: 'pointer', fontWeight: '600', fontSize: '14px'
              }}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <span onClick={() => { navigate('/login'); setMenuOpen(false); }}
              style={{color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '15px'}}>
              Login
            </span>
            <button onClick={() => { navigate('/register'); setMenuOpen(false); }} style={{
              backgroundColor: 'white', color: '#db2777',
              border: 'none', padding: '10px 20px',
              borderRadius: '25px', cursor: 'pointer',
              fontWeight: '700', fontSize: '14px'
            }}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
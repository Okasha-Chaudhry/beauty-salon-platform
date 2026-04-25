import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SalonProfile from './pages/SalonProfile';
import Register from './pages/Register';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
   localStorage.removeItem('user');
   localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <header style={{backgroundColor: '#db2777', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <span onClick={() => navigate('/')} style={{fontSize: '22px', fontWeight: 'bold', cursor: 'pointer'}}>
        💄 Beauty Salon Finder
      </span>
      <nav style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
        <span onClick={() => navigate('/')} style={{cursor: 'pointer', fontWeight: '500'}}>Home</span>
        {user ? (
          <>
            <span onClick={() => navigate('/my-bookings')} style={{cursor: 'pointer', fontWeight: '500'}}>My Bookings</span>
            {user.role === 'admin' && (
              <span onClick={() => navigate('/admin')} style={{cursor: 'pointer', fontWeight: '500'}}>🛠️ Admin</span>
            )}
            <span style={{fontWeight: '500'}}>👋 {user.name}</span>
            <button onClick={handleLogout} style={{backgroundColor: 'white', color: '#db2777', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}>
              Logout
            </button>
          </>
        ) : (
          <>
            <span onClick={() => navigate('/login')} style={{cursor: 'pointer', fontWeight: '500'}}>Login</span>
            <button onClick={() => navigate('/register')} style={{backgroundColor: 'white', color: '#db2777', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}>
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/salon/:id" element={<SalonProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
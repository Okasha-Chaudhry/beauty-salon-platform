import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('overview');
  const [salons, setSalons] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New salon form
  const [newSalon, setNewSalon] = useState({
    name: '', description: '', location: '',
    priceRange: '', contactInfo: '', workingHours: '',
    services: ''
  });
  const [salonMsg, setSalonMsg] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [s, b, u] = await Promise.all([
        API.get('/salons'),
        API.get('/bookings'),
        API.get('/users')
      ]);
      setSalons(s.data);
      setBookings(b.data);
      setUsers(u.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddSalon = async (e) => {
    e.preventDefault();
    try {
      await API.post('/salons', {
        ...newSalon,
        services: newSalon.services.split(',').map(s => s.trim())
      });
      setSalonMsg('✅ Salon added successfully!');
      setNewSalon({ name: '', description: '', location: '', priceRange: '', contactInfo: '', workingHours: '', services: '' });
      fetchAll();
    } catch (err) {
      setSalonMsg('❌ Failed to add salon');
    }
  };

  const handleDeleteSalon = async (id) => {
    if (!window.confirm('Delete this salon?')) return;
    try {
      await API.delete(`/salons/${id}`);
      setSalons(salons.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBooking = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      console.error(err);
    }
  };

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #db2777' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#db2777' : 'gray',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    cursor: 'pointer',
    fontSize: '15px'
  });

  const getStatusColor = (status) => {
    if (status === 'confirmed') return '#16a34a';
    if (status === 'cancelled') return '#dc2626';
    return '#d97706';
  };

  if (loading) return <p style={{textAlign: 'center', padding: '40px'}}>Loading dashboard...</p>;

  return (
    <div style={{maxWidth: '1100px', margin: '0 auto', padding: '24px'}}>
      <h2 style={{color: '#db2777', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px'}}>
        🛠️ Admin Dashboard
      </h2>
      <p style={{color: 'gray', marginBottom: '24px'}}>Manage your beauty salon platform</p>

      {/* Overview Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px'}}>
        {[
          { label: 'Total Salons', value: salons.length, icon: '💄', color: '#fdf2f8' },
          { label: 'Total Bookings', value: bookings.length, icon: '📅', color: '#f0fdf4' },
          { label: 'Total Users', value: users.length, icon: '👥', color: '#eff6ff' },
          { label: 'Pending Bookings', value: bookings.filter(b => b.status === 'pending').length, icon: '⏳', color: '#fffbeb' },
        ].map((card, i) => (
          <div key={i} style={{backgroundColor: card.color, borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
            <p style={{fontSize: '36px'}}>{card.icon}</p>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: '#db2777', marginTop: '8px'}}>{card.value}</p>
            <p style={{color: 'gray', marginTop: '4px'}}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{borderBottom: '1px solid #fce7f3', marginBottom: '24px', display: 'flex', gap: '8px', overflowX: 'auto'}}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
        <button style={tabStyle('salons')} onClick={() => setActiveTab('salons')}>Salons</button>
        <button style={tabStyle('bookings')} onClick={() => setActiveTab('bookings')}>Bookings</button>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Users</button>
        <button style={tabStyle('addSalon')} onClick={() => setActiveTab('addSalon')}>+ Add Salon</button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Recent Bookings</h3>
          {bookings.slice(0, 5).map((b, i) => (
            <div key={i} style={{border: '1px solid #fce7f3', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'}}>
              <div>
                <p style={{fontWeight: '600'}}>{b.customer?.name || 'Customer'}</p>
                <p style={{color: 'gray', fontSize: '14px'}}>{b.salon?.name} — {b.service}</p>
                <p style={{color: 'gray', fontSize: '14px'}}>📅 {new Date(b.date).toLocaleDateString()} at {b.timeSlot}</p>
              </div>
              <span style={{backgroundColor: getStatusColor(b.status) + '20', color: getStatusColor(b.status), padding: '4px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize'}}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Salons Tab */}
      {activeTab === 'salons' && (
        <div>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>All Salons ({salons.length})</h3>
          {salons.map((salon, i) => (
            <div key={i} style={{border: '1px solid #fce7f3', borderRadius: '12px', padding: '20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'}}>
              <div>
                <p style={{fontWeight: 'bold', fontSize: '18px', color: '#db2777'}}>{salon.name}</p>
                <p style={{color: 'gray'}}>📍 {salon.location} | 💰 {salon.priceRange}</p>
                <p style={{color: 'gray', fontSize: '14px', marginTop: '4px'}}>{salon.services.join(', ')}</p>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={() => navigate(`/salon/${salon._id}`)}
                  style={{padding: '8px 16px', backgroundColor: 'transparent', border: '2px solid #db2777', color: '#db2777', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteSalon(salon._id)}
                  style={{padding: '8px 16px', backgroundColor: '#fee2e2', border: 'none', color: '#dc2626', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>All Bookings ({bookings.length})</h3>
          {bookings.map((b, i) => (
            <div key={i} style={{border: '1px solid #fce7f3', borderRadius: '12px', padding: '20px', marginBottom: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
                <div>
                  <p style={{fontWeight: 'bold', fontSize: '16px'}}>{b.customer?.name || 'Customer'}</p>
                  <p style={{color: 'gray'}}>{b.customer?.email}</p>
                  <p style={{marginTop: '8px'}}>💅 <strong>{b.service}</strong> at {b.salon?.name}</p>
                  <p style={{color: 'gray', fontSize: '14px'}}>📅 {new Date(b.date).toLocaleDateString()} at {b.timeSlot}</p>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end'}}>
                  <span style={{backgroundColor: getStatusColor(b.status) + '20', color: getStatusColor(b.status), padding: '4px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize'}}>
                    {b.status}
                  </span>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => handleUpdateBooking(b._id, 'confirmed')}
                      style={{padding: '6px 12px', backgroundColor: '#dcfce7', border: 'none', color: '#16a34a', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px'}}
                    >
                      ✓ Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateBooking(b._id, 'cancelled')}
                      style={{padding: '6px 12px', backgroundColor: '#fee2e2', border: 'none', color: '#dc2626', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px'}}
                    >
                      ✗ Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>All Users ({users.length})</h3>
          {users.map((u, i) => (
            <div key={i} style={{border: '1px solid #fce7f3', borderRadius: '12px', padding: '20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'}}>
              <div>
                <p style={{fontWeight: 'bold', fontSize: '16px'}}>👤 {u.name}</p>
                <p style={{color: 'gray'}}>{u.email}</p>
              </div>
              <span style={{backgroundColor: u.role === 'admin' ? '#fdf2f8' : '#eff6ff', color: u.role === 'admin' ? '#db2777' : '#2563eb', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize'}}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Salon Tab */}
      {activeTab === 'addSalon' && (
        <div style={{maxWidth: '600px'}}>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Add New Salon</h3>
          {salonMsg && <p style={{color: salonMsg.includes('✅') ? 'green' : 'red', marginBottom: '16px'}}>{salonMsg}</p>}
          <form onSubmit={handleAddSalon}>
            {[
              { label: 'Salon Name', key: 'name', placeholder: 'e.g. Glamour Studio' },
              { label: 'Description', key: 'description', placeholder: 'Brief description' },
              { label: 'Location', key: 'location', placeholder: 'e.g. Multan, Pakistan' },
              { label: 'Price Range', key: 'priceRange', placeholder: 'e.g. Rs. 500 - 3000' },
              { label: 'Contact Info', key: 'contactInfo', placeholder: 'e.g. 0300-1234567' },
              { label: 'Working Hours', key: 'workingHours', placeholder: 'e.g. 9am - 8pm' },
              { label: 'Services (comma separated)', key: 'services', placeholder: 'e.g. Haircut, Facial, Manicure' },
            ].map((field, i) => (
              <div key={i} style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>{field.label}</label>
                <input
                  type="text"
                  value={newSalon[field.key]}
                  onChange={e => setNewSalon({...newSalon, [field.key]: e.target.value})}
                  placeholder={field.placeholder}
                  required
                  style={{width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'}}
                />
              </div>
            ))}
            <button
              type="submit"
              style={{width: '100%', padding: '12px', backgroundColor: '#db2777', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              Add Salon 💄
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
import ImageUpload from '../components/ImageUpload';
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
  const [newSalon, setNewSalon] = useState({
    name: '', description: '', location: '',
    priceRange: '', contactInfo: '', workingHours: '', services: '', image: ''
  });
  const [salonMsg, setSalonMsg] = useState('');

  // eslint-disable-next-line
  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
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
    } catch (err) { console.error(err); }
  };

  const handleUpdateBooking = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) { console.error(err); }
  };

  const getStatusStyle = (status) => {
    if (status === 'confirmed') return { bg: '#f0fdf4', color: '#16a34a', border: '#86efac' };
    if (status === 'cancelled') return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' };
    return { bg: '#fffbeb', color: '#d97706', border: '#fcd34d' };
  };

  if (loading) return (
    <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <p style={{fontSize: '48px'}}>⏳</p>
        <p style={{color: '#6b7280', marginTop: '16px', fontSize: '18px'}}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb'}}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        padding: '40px 32px', color: 'white'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <p style={{color: '#f9a8d4', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px', marginBottom: '8px'}}>
            Admin Panel
          </p>
          <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: '40px', fontWeight: '700', marginBottom: '8px'}}>
            🛠️ Dashboard
          </h1>
          <p style={{color: 'rgba(255,255,255,0.6)'}}>
            Welcome back, {user?.name}! Manage your GlamourFind platform.
          </p>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px'}}>

        {/* Stats Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px'}}>
          {[
            { label: 'Total Salons', value: salons.length, icon: '💄', color: '#fdf2f8', border: '#fce7f3', trend: '+2 this month' },
            { label: 'Total Bookings', value: bookings.length, icon: '📅', color: '#f0fdf4', border: '#bbf7d0', trend: '+5 this week' },
            { label: 'Total Users', value: users.length, icon: '👥', color: '#eff6ff', border: '#bfdbfe', trend: '+3 today' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: '⏳', color: '#fffbeb', border: '#fde68a', trend: 'Needs attention' },
          ].map((card, i) => (
            <div key={i} style={{
              background: card.color, borderRadius: '20px',
              padding: '24px', border: `1px solid ${card.border}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <p style={{color: '#6b7280', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase'}}>{card.label}</p>
                  <p style={{fontSize: '40px', fontWeight: '700', color: '#db2777', marginTop: '8px', fontFamily: "'Playfair Display', serif"}}>{card.value}</p>
                  <p style={{color: '#9ca3af', fontSize: '12px', marginTop: '4px'}}>{card.trend}</p>
                </div>
                <span style={{fontSize: '36px'}}>{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '4px', marginBottom: '24px',
          display: 'flex', gap: '4px', flexWrap: 'wrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'salons', label: '💄 Salons' },
            { key: 'bookings', label: '📅 Bookings' },
            { key: 'users', label: '👥 Users' },
            { key: 'addSalon', label: '➕ Add Salon' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '12px 16px',
                border: 'none', borderRadius: '12px',
                background: activeTab === tab.key ? 'linear-gradient(135deg, #db2777, #9d174d)' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#6b7280',
                fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.3s',
                minWidth: '100px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              {/* Recent Bookings */}
              <div style={{background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', gridColumn: 'span 2'}}>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '20px', color: '#1f2937'}}>
                  Recent Bookings
                </h3>
                {bookings.slice(0, 5).map((b, i) => {
                  const style = getStatusStyle(b.status);
                  return (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', padding: '16px',
                      borderRadius: '12px', marginBottom: '10px',
                      background: '#f9fafb', flexWrap: 'wrap', gap: '12px'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #db2777, #9d174d)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: '700'
                        }}>
                          {b.customer?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p style={{fontWeight: '700', color: '#1f2937'}}>{b.customer?.name || 'Customer'}</p>
                          <p style={{color: '#6b7280', fontSize: '13px'}}>{b.salon?.name} — {b.service}</p>
                          <p style={{color: '#9ca3af', fontSize: '12px'}}>📅 {new Date(b.date).toLocaleDateString()} at {b.timeSlot}</p>
                        </div>
                      </div>
                      <span style={{
                        background: style.bg, color: style.color,
                        border: `1px solid ${style.border}`,
                        padding: '4px 14px', borderRadius: '20px',
                        fontWeight: '700', fontSize: '13px',
                        textTransform: 'capitalize'
                      }}>{b.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Salons Tab */}
        {activeTab === 'salons' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#1f2937'}}>
                All Salons ({salons.length})
              </h3>
              <button
                onClick={() => setActiveTab('addSalon')}
                style={{
                  background: 'linear-gradient(135deg, #db2777, #9d174d)',
                  color: 'white', border: 'none',
                  padding: '10px 20px', borderRadius: '25px',
                  cursor: 'pointer', fontWeight: '700'
                }}
              >+ Add New Salon</button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {salons.map((salon, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: '16px',
                  padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '12px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '16px',
                      background: 'linear-gradient(135deg, #fce7f3, #db2777)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px'
                    }}>💄</div>
                    <div>
                      <p style={{fontWeight: '700', fontSize: '18px', color: '#1f2937', fontFamily: "'Playfair Display', serif"}}>{salon.name}</p>
                      <p style={{color: '#6b7280', fontSize: '14px'}}>📍 {salon.location} | 💰 {salon.priceRange}</p>
                      <div style={{display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap'}}>
                        {salon.services.slice(0, 3).map((s, j) => (
                          <span key={j} style={{background: '#fdf2f8', color: '#db2777', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'}}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => navigate(`/salon/${salon._id}`)}
                      style={{padding: '8px 18px', background: 'transparent', border: '2px solid #db2777', color: '#db2777', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '13px'}}
                    >View</button>
                    <button
                      onClick={() => handleDeleteSalon(salon._id)}
                      style={{padding: '8px 18px', background: '#fef2f2', border: '2px solid #fca5a5', color: '#dc2626', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '13px'}}
                    >Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#1f2937', marginBottom: '20px'}}>
              All Bookings ({bookings.length})
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {bookings.map((b, i) => {
                const style = getStatusStyle(b.status);
                return (
                  <div key={i} style={{
                    background: 'white', borderRadius: '16px',
                    padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #db2777, #9d174d)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: '700', fontSize: '18px'
                        }}>
                          {b.customer?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p style={{fontWeight: '700', fontSize: '16px', color: '#1f2937'}}>{b.customer?.name || 'Customer'}</p>
                          <p style={{color: '#6b7280', fontSize: '13px'}}>{b.customer?.email}</p>
                          <p style={{marginTop: '4px', fontSize: '14px'}}>💅 <strong>{b.service}</strong> at {b.salon?.name}</p>
                          <p style={{color: '#6b7280', fontSize: '13px'}}>📅 {new Date(b.date).toLocaleDateString()} at {b.timeSlot}</p>
                        </div>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end'}}>
                        <span style={{
                          background: style.bg, color: style.color,
                          border: `1px solid ${style.border}`,
                          padding: '4px 14px', borderRadius: '20px',
                          fontWeight: '700', fontSize: '13px',
                          textTransform: 'capitalize'
                        }}>{b.status}</span>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button
                            onClick={() => handleUpdateBooking(b._id, 'confirmed')}
                            style={{padding: '6px 14px', background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px'}}
                          >✓ Confirm</button>
                          <button
                            onClick={() => handleUpdateBooking(b._id, 'cancelled')}
                            style={{padding: '6px 14px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px'}}
                          >✗ Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#1f2937', marginBottom: '20px'}}>
              All Users ({users.length})
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {users.map((u, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: '16px',
                  padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '12px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #db2777, #9d174d)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: '700', fontSize: '18px'
                    }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{fontWeight: '700', fontSize: '16px', color: '#1f2937'}}>👤 {u.name}</p>
                      <p style={{color: '#6b7280', fontSize: '14px'}}>{u.email}</p>
                    </div>
                  </div>
                  <span style={{
                    background: u.role === 'admin' ? '#fdf2f8' : u.role === 'salon_owner' ? '#fffbeb' : '#eff6ff',
                    color: u.role === 'admin' ? '#db2777' : u.role === 'salon_owner' ? '#d97706' : '#2563eb',
                    padding: '6px 16px', borderRadius: '20px',
                    fontWeight: '700', fontSize: '13px',
                    textTransform: 'capitalize'
                  }}>
                    {u.role === 'admin' ? '👑 Admin' : u.role === 'salon_owner' ? '💄 Salon Owner' : '👤 Customer'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Salon Tab */}
        {activeTab === 'addSalon' && (
          <div style={{background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '600px'}}>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '8px', color: '#1f2937'}}>Add New Salon</h3>
            <p style={{color: '#6b7280', marginBottom: '24px'}}>Fill in the details to list a new salon</p>

            {salonMsg && (
              <div style={{
                background: salonMsg.includes('✅') ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${salonMsg.includes('✅') ? '#86efac' : '#fca5a5'}`,
                color: salonMsg.includes('✅') ? '#16a34a' : '#dc2626',
                padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
                fontWeight: '600', textAlign: 'center'
              }}>{salonMsg}</div>
            )}

            <form onSubmit={handleAddSalon}>
              {[
                { label: 'Salon Name', key: 'name', placeholder: 'e.g. Glamour Studio' },
                { label: 'Description', key: 'description', placeholder: 'Brief description of the salon' },
                { label: 'Location', key: 'location', placeholder: 'e.g. Multan, Punjab' },
                { label: 'Price Range', key: 'priceRange', placeholder: 'e.g. Rs. 500 - 3000' },
                { label: 'Contact Info', key: 'contactInfo', placeholder: 'e.g. 0300-1234567' },
                { label: 'Working Hours', key: 'workingHours', placeholder: 'e.g. 9am - 8pm' },
                { label: 'Services (comma separated)', key: 'services', placeholder: 'e.g. Haircut, Facial, Manicure' },
              ].map((field, i) => (
                <div key={i} style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px'}}>{field.label}</label>
                  <input
                    type="text"
                    value={newSalon[field.key]}
                    onChange={e => setNewSalon({...newSalon, [field.key]: e.target.value})}
                    placeholder={field.placeholder}
                    required
                    style={{
                      width: '100%', padding: '12px 16px',
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
              <button
                type="submit"
                style={{
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, #db2777, #9d174d)',
                  color: 'white', border: 'none',
                  borderRadius: '12px', fontSize: '16px',
                  fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(219,39,119,0.4)'
                }}
              >Add Salon 💄</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
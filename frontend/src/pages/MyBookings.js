import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // eslint-disable-next-line
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    API.get('/bookings')
      .then(res => {
        const myBookings = res.data.filter(b => b.customer?._id === user._id);
        setBookings(myBookings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'confirmed') return { bg: '#f0fdf4', color: '#16a34a', border: '#86efac' };
    if (status === 'cancelled') return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' };
    return { bg: '#fffbeb', color: '#d97706', border: '#fcd34d' };
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return (
    <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <p style={{fontSize: '48px', marginBottom: '16px'}}>⏳</p>
        <p style={{color: '#6b7280', fontSize: '18px'}}>Loading your bookings...</p>
      </div>
    </div>
  );

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb', padding: '40px 32px'}}>
      <div style={{maxWidth: '900px', margin: '0 auto'}}>

        {/* Header */}
        <div style={{marginBottom: '32px'}}>
          <p style={{color: '#db2777', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px'}}>Your Appointments</p>
          <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#1f2937', marginBottom: '8px'}}>
            My Bookings
          </h1>
          <p style={{color: '#6b7280'}}>{bookings.length} total bookings</p>
        </div>

        {/* Stats Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px'}}>
          {[
            { label: 'Total', value: bookings.length, icon: '📅', color: '#fdf2f8' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: '⏳', color: '#fffbeb' },
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: '✅', color: '#f0fdf4' },
            { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: '❌', color: '#fef2f2' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: stat.color, borderRadius: '16px',
              padding: '20px', textAlign: 'center',
              border: '1px solid #fce7f3'
            }}>
              <p style={{fontSize: '28px'}}>{stat.icon}</p>
              <p style={{fontSize: '28px', fontWeight: '700', color: '#db2777', marginTop: '4px'}}>{stat.value}</p>
              <p style={{color: '#6b7280', fontSize: '13px', marginTop: '4px'}}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap'}}>
          {['all', 'pending', 'confirmed', 'cancelled'].map((f, i) => (
            <button
              key={i}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px', borderRadius: '25px',
                border: '2px solid',
                borderColor: filter === f ? '#db2777' : '#fce7f3',
                background: filter === f ? '#db2777' : 'white',
                color: filter === f ? 'white' : '#db2777',
                fontWeight: '600', fontSize: '14px',
                cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? '📋 All' : f === 'pending' ? '⏳ Pending' : f === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <p style={{fontSize: '64px'}}>📭</p>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '24px', marginTop: '16px', color: '#1f2937'}}>
              No bookings found
            </h3>
            <p style={{color: '#6b7280', marginTop: '8px', marginBottom: '24px'}}>
              {filter === 'all' ? "You haven't made any bookings yet!" : `No ${filter} bookings found`}
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #db2777, #9d174d)',
                color: 'white', border: 'none',
                padding: '14px 32px', borderRadius: '25px',
                fontWeight: '700', fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Find a Salon 💅
            </button>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {filtered.map((booking) => {
              const statusStyle = getStatusColor(booking.status);
              return (
                <div key={booking._id} style={{
                  background: 'white', borderRadius: '20px',
                  padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: '1px solid #fce7f3'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px'}}>
                    <div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '22px', color: '#1f2937', fontWeight: '700'
                      }}>
                        {booking.salon?.name || 'Salon'}
                      </h3>
                      <p style={{color: '#6b7280', marginTop: '4px', fontSize: '14px'}}>
                        📍 {booking.salon?.location || 'Location'}
                      </p>
                    </div>
                    <span style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`,
                      padding: '6px 16px', borderRadius: '20px',
                      fontWeight: '700', fontSize: '13px',
                      textTransform: 'capitalize'
                    }}>
                      {booking.status === 'confirmed' ? '✅' : booking.status === 'cancelled' ? '❌' : '⏳'} {booking.status}
                    </span>
                  </div>

                  <div style={{
                    marginTop: '20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '12px'
                  }}>
                    {[
                      { label: 'SERVICE', value: `💅 ${booking.service}` },
                      { label: 'DATE', value: `📅 ${new Date(booking.date).toLocaleDateString('en-PK', {day: 'numeric', month: 'long', year: 'numeric'})}` },
                      { label: 'TIME', value: `🕐 ${booking.timeSlot}` },
                      { label: 'PAYMENT', value: `💳 ${booking.paymentStatus}` },
                    ].map((item, i) => (
                      <div key={i} style={{
                        background: '#f9fafb', padding: '14px',
                        borderRadius: '12px', border: '1px solid #f3f4f6'
                      }}>
                        <p style={{color: '#9ca3af', fontSize: '11px', fontWeight: '700', letterSpacing: '1px'}}>{item.label}</p>
                        <p style={{fontWeight: '600', marginTop: '6px', fontSize: '14px', color: '#1f2937'}}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                    <button
                      onClick={() => navigate(`/salon/${booking.salon?._id}`)}
                      style={{
                        padding: '10px 24px',
                        background: 'transparent',
                        border: '2px solid #db2777',
                        color: '#db2777', borderRadius: '25px',
                        cursor: 'pointer', fontWeight: '700', fontSize: '14px'
                      }}
                    >
                      View Salon →
                    </button>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        style={{
                          padding: '10px 24px',
                          background: '#fef2f2',
                          border: '2px solid #fca5a5',
                          color: '#dc2626', borderRadius: '25px',
                          cursor: 'pointer', fontWeight: '700', fontSize: '14px'
                        }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
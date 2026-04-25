import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'confirmed') return '#16a34a';
    if (status === 'cancelled') return '#dc2626';
    return '#d97706';
  };

  if (loading) return <p style={{textAlign: 'center', padding: '40px', color: 'gray'}}>Loading bookings...</p>;

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '24px'}}>
      <h2 style={{color: '#db2777', fontSize: '28px', fontWeight: 'bold', marginBottom: '24px'}}>
        📅 My Bookings
      </h2>

      {bookings.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px', backgroundColor: '#fdf2f8', borderRadius: '16px'}}>
          <p style={{fontSize: '48px'}}>📭</p>
          <p style={{color: 'gray', fontSize: '18px', marginTop: '16px'}}>No bookings yet!</p>
          <button
            onClick={() => navigate('/')}
            style={{marginTop: '16px', padding: '12px 24px', backgroundColor: '#db2777', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}
          >
            Find a Salon
          </button>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking._id} style={{
              border: '1px solid #fce7f3',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px'}}>
                <div>
                  <h3 style={{color: '#db2777', fontSize: '20px', fontWeight: 'bold'}}>
                    {booking.salon?.name || 'Salon'}
                  </h3>
                  <p style={{color: 'gray', marginTop: '4px'}}>
                    📍 {booking.salon?.location || 'Location'}
                  </p>
                </div>
                <span style={{
                  backgroundColor: getStatusColor(booking.status) + '20',
                  color: getStatusColor(booking.status),
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '14px',
                  textTransform: 'capitalize'
                }}>
                  {booking.status}
                </span>
              </div>

              <div style={{marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px'}}>
                <div style={{backgroundColor: '#fdf2f8', padding: '12px', borderRadius: '8px'}}>
                  <p style={{color: 'gray', fontSize: '12px'}}>SERVICE</p>
                  <p style={{fontWeight: '600', marginTop: '4px'}}>💅 {booking.service}</p>
                </div>
                <div style={{backgroundColor: '#fdf2f8', padding: '12px', borderRadius: '8px'}}>
                  <p style={{color: 'gray', fontSize: '12px'}}>DATE</p>
                  <p style={{fontWeight: '600', marginTop: '4px'}}>
                    📅 {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
                <div style={{backgroundColor: '#fdf2f8', padding: '12px', borderRadius: '8px'}}>
                  <p style={{color: 'gray', fontSize: '12px'}}>TIME</p>
                  <p style={{fontWeight: '600', marginTop: '4px'}}>🕐 {booking.timeSlot}</p>
                </div>
                <div style={{backgroundColor: '#fdf2f8', padding: '12px', borderRadius: '8px'}}>
                  <p style={{color: 'gray', fontSize: '12px'}}>PAYMENT</p>
                  <p style={{fontWeight: '600', marginTop: '4px'}}>
                    💳 {booking.paymentStatus}
                  </p>
                </div>
              </div>

              <div style={{marginTop: '16px', display: 'flex', gap: '12px'}}>
                <button
                  onClick={() => navigate(`/salon/${booking.salon?._id}`)}
                  style={{padding: '8px 16px', backgroundColor: 'transparent', border: '2px solid #db2777', color: '#db2777', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}
                >
                  View Salon
                </button>
                {booking.status === 'pending' && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    style={{padding: '8px 16px', backgroundColor: '#fee2e2', border: 'none', color: '#dc2626', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
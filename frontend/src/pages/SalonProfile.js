import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSalon, createBooking, getReviews, createReview } from '../services/api';

const SalonProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  // Booking form
  const [booking, setBooking] = useState({
    service: '', date: '', timeSlot: ''
  });
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingErr, setBookingErr] = useState('');

  // Review form
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  useEffect(() => {
    getSalon(id)
      .then(res => { setSalon(res.data); setLoading(false); })
      .catch(() => setLoading(false));
    getReviews(id)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await createBooking({
        customer: user._id,
        salon: id,
        service: booking.service,
        date: booking.date,
        timeSlot: booking.timeSlot
      });
      setBookingMsg('✅ Booking confirmed successfully!');
      setBookingErr('');
      setBooking({ service: '', date: '', timeSlot: '' });
    } catch (err) {
      setBookingErr('❌ Booking failed. Please try again.');
      setBookingMsg('');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await createReview({ customer: user._id, salon: id, ...review });
      setReviewMsg('✅ Review submitted!');
      const res = await getReviews(id);
      setReviews(res.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{textAlign: 'center', padding: '40px', color: 'gray'}}>Loading salon...</p>;
  if (!salon) return <p style={{textAlign: 'center', padding: '40px', color: 'red'}}>Salon not found!</p>;

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #db2777' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#db2777' : 'gray',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    cursor: 'pointer',
    fontSize: '16px'
  });

  return (
    <div style={{maxWidth: '900px', margin: '0 auto', padding: '24px'}}>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{marginBottom: '16px', backgroundColor: 'transparent', border: '2px solid #db2777', color: '#db2777', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}
      >
        ← Back to Salons
      </button>

      {/* Salon Header */}
      <div style={{backgroundColor: '#fdf2f8', borderRadius: '16px', padding: '32px', marginBottom: '24px'}}>
        <h1 style={{color: '#db2777', fontSize: '32px', fontWeight: 'bold'}}>{salon.name}</h1>
        <p style={{color: 'gray', marginTop: '8px', fontSize: '16px'}}>{salon.description}</p>
        <div style={{marginTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
          <span>📍 {salon.location}</span>
          <span>💰 {salon.priceRange}</span>
          <span>🕐 {salon.workingHours}</span>
          <span>📞 {salon.contactInfo}</span>
        </div>
        <div style={{marginTop: '16px'}}>
          {salon.services.map((service, i) => (
            <span key={i} style={{
              backgroundColor: '#db2777', color: 'white',
              padding: '4px 12px', borderRadius: '20px',
              fontSize: '13px', marginRight: '8px',
              display: 'inline-block', marginTop: '4px'
            }}>
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderBottom: '1px solid #fce7f3', marginBottom: '24px', display: 'flex', gap: '8px'}}>
        <button style={tabStyle('about')} onClick={() => setActiveTab('about')}>About</button>
        <button style={tabStyle('booking')} onClick={() => setActiveTab('booking')}>Book Appointment</button>
        <button style={tabStyle('reviews')} onClick={() => setActiveTab('reviews')}>Reviews ({reviews.length})</button>
      </div>

      {/* About Tab */}
      {activeTab === 'about' && (
        <div>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Our Services</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px'}}>
            {salon.services.map((service, i) => (
              <div key={i} style={{backgroundColor: '#fdf2f8', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
                <p style={{fontSize: '32px'}}>💅</p>
                <p style={{fontWeight: '600', marginTop: '8px'}}>{service}</p>
              </div>
            ))}
          </div>
          <div style={{marginTop: '24px', backgroundColor: '#fdf2f8', borderRadius: '12px', padding: '20px'}}>
            <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px'}}>Salon Info</h3>
            <p>📍 <strong>Location:</strong> {salon.location}</p>
            <p style={{marginTop: '8px'}}>🕐 <strong>Working Hours:</strong> {salon.workingHours}</p>
            <p style={{marginTop: '8px'}}>📞 <strong>Contact:</strong> {salon.contactInfo}</p>
            <p style={{marginTop: '8px'}}>💰 <strong>Price Range:</strong> {salon.priceRange}</p>
          </div>
        </div>
      )}

      {/* Booking Tab */}
      {activeTab === 'booking' && (
        <div style={{maxWidth: '500px'}}>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Book an Appointment</h3>
          {!user && (
            <p style={{color: '#db2777', marginBottom: '16px'}}>
              Please <span onClick={() => navigate('/login')} style={{cursor: 'pointer', textDecoration: 'underline'}}>login</span> to book an appointment.
            </p>
          )}
          {bookingMsg && <p style={{color: 'green', marginBottom: '16px'}}>{bookingMsg}</p>}
          {bookingErr && <p style={{color: 'red', marginBottom: '16px'}}>{bookingErr}</p>}
          <form onSubmit={handleBooking}>
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Select Service</label>
              <select
                value={booking.service}
                onChange={e => setBooking({...booking, service: e.target.value})}
                required
                style={{width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px'}}
              >
                <option value="">Choose a service...</option>
                {salon.services.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Select Date</label>
              <input
                type="date"
                value={booking.date}
                onChange={e => setBooking({...booking, date: e.target.value})}
                required
                min={new Date().toISOString().split('T')[0]}
                style={{width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'}}
              />
            </div>
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Select Time Slot</label>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
                {timeSlots.map((slot, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBooking({...booking, timeSlot: slot})}
                    style={{
                      padding: '8px',
                      border: '2px solid',
                      borderColor: booking.timeSlot === slot ? '#db2777' : '#fce7f3',
                      backgroundColor: booking.timeSlot === slot ? '#fdf2f8' : 'white',
                      color: booking.timeSlot === slot ? '#db2777' : 'gray',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: booking.timeSlot === slot ? 'bold' : 'normal'
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              style={{width: '100%', padding: '12px', backgroundColor: '#db2777', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              Confirm Booking 💅
            </button>
          </form>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Customer Reviews</h3>

          {/* Add Review Form */}
          {user && (
            <div style={{backgroundColor: '#fdf2f8', borderRadius: '12px', padding: '20px', marginBottom: '24px'}}>
              <h4 style={{fontWeight: '600', marginBottom: '12px'}}>Leave a Review</h4>
              {reviewMsg && <p style={{color: 'green', marginBottom: '12px'}}>{reviewMsg}</p>}
              <form onSubmit={handleReview}>
                <div style={{marginBottom: '12px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Rating</label>
                  <select
                    value={review.rating}
                    onChange={e => setReview({...review, rating: e.target.value})}
                    style={{padding: '8px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px'}}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                    <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                    <option value="3">⭐⭐⭐ 3 - Good</option>
                    <option value="2">⭐⭐ 2 - Fair</option>
                    <option value="1">⭐ 1 - Poor</option>
                  </select>
                </div>
                <div style={{marginBottom: '12px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={e => setReview({...review, comment: e.target.value})}
                    placeholder="Share your experience..."
                    rows="3"
                    style={{width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'}}
                  />
                </div>
                <button
                  type="submit"
                  style={{padding: '10px 24px', backgroundColor: '#db2777', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p style={{color: 'gray'}}>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} style={{border: '1px solid #fce7f3', borderRadius: '12px', padding: '16px', marginBottom: '12px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <strong>{r.customer?.name || 'Customer'}</strong>
                  <span>{'⭐'.repeat(r.rating)}</span>
                </div>
                <p style={{color: 'gray', marginTop: '8px'}}>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SalonProfile;
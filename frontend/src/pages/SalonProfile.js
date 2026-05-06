import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { createPaymentIntent } from '../services/api';
import MapComponent from '../components/MapComponent';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSalon, createBooking, getReviews, createReview } from '../services/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SalonProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [booking, setBooking] = useState({ service: '', date: '', timeSlot: '' });
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingErr, setBookingErr] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [savedBookingId, setSavedBookingId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  useEffect(() => {
    getSalon(id).then(res => { setSalon(res.data); setLoading(false); }).catch(() => setLoading(false));
    getReviews(id).then(res => setReviews(res.data)).catch(console.error);
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      const bookingRes = await createBooking({
        customer: user._id,
        salon: id,
        ...booking
      });
      const newBookingId = bookingRes.data._id;
      setSavedBookingId(newBookingId);
      const paymentRes = await createPaymentIntent({
        amount: paymentAmount,
        bookingId: newBookingId
      });
      setClientSecret(paymentRes.data.clientSecret);
      setShowPayment(true);
      setBookingMsg('');
      setBookingErr('');
    } catch (err) {
      setBookingErr('❌ Booking failed. Please try again.');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setBookingMsg('✅ Booking & Payment successful! You will receive a confirmation email.');
    setBooking({ service: '', date: '', timeSlot: '' });
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
    } catch (err) { console.error(err); }
  };

  const avgRating = salon?.ratings?.length > 0
    ? (salon.ratings.reduce((a, b) => a + b, 0) / salon.ratings.length).toFixed(1)
    : null;

  if (loading) return (
    <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <p style={{fontSize: '48px'}}>💄</p>
        <p style={{color: '#6b7280', marginTop: '16px', fontSize: '18px'}}>Loading salon...</p>
      </div>
    </div>
  );

  if (!salon) return (
    <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <p style={{fontSize: '48px'}}>😕</p>
        <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '24px', marginTop: '16px'}}>Salon not found</h3>
        <button onClick={() => navigate('/')} style={{marginTop: '16px', padding: '12px 24px', background: '#db2777', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '700'}}>Go Home</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb'}}>

 {/* Hero Banner */}
<div style={{
  height: '300px',
  background: salon.images && salon.images.length > 0
    ? 'none'
    : 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
  position: 'relative', overflow: 'hidden'
}}>
  {salon.images && salon.images.length > 0 ? (
    <img
      src={salon.images[0].url}
      alt={salon.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  ) : (
    <div style={{
      height: '100%',
      background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <span style={{fontSize: '64px'}}>💄</span>
    </div>
  )}
  {/* Overlay with salon name */}
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    padding: '40px 32px 24px',
    color: 'white'
  }}>
    <h1 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '48px', fontWeight: '700'
    }}>{salon.name}</h1>
    <p style={{opacity: 0.85, fontSize: '18px', marginTop: '8px'}}>{salon.description}</p>
  </div>
</div>

        {/* Info Card */}
        <div style={{
          background: 'white', borderRadius: '20px',
          padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
                {avgRating && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: '#fffbeb', padding: '6px 14px', borderRadius: '20px'}}>
                    <span style={{color: '#f59e0b', fontSize: '16px'}}>⭐</span>
                    <span style={{fontWeight: '700', color: '#d97706'}}>{avgRating}</span>
                    <span style={{color: '#6b7280', fontSize: '13px'}}>({reviews.length} reviews)</span>
                  </div>
                )}
                <div style={{background: '#f0fdf4', padding: '6px 14px', borderRadius: '20px'}}>
                  <span style={{color: '#16a34a', fontWeight: '600', fontSize: '14px'}}>🟢 Open Now</span>
                </div>
              </div>
              <div style={{display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap'}}>
                {[
                  { icon: '📍', text: salon.location },
                  { icon: '💰', text: salon.priceRange },
                  { icon: '🕐', text: salon.workingHours },
                  { icon: '📞', text: salon.contactInfo },
                ].map((item, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <span>{item.icon}</span>
                    <span style={{color: '#374151', fontSize: '14px', fontWeight: '500'}}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px', background: 'transparent',
                border: '2px solid #db2777', color: '#db2777',
                borderRadius: '25px', cursor: 'pointer',
                fontWeight: '700', fontSize: '14px'
              }}
            >← Back</button>
          </div>

          {/* Services Tags */}
          <div style={{marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
            {salon.services.map((service, i) => (
              <span key={i} style={{
                background: 'linear-gradient(135deg, #db2777, #9d174d)',
                color: 'white', padding: '6px 16px',
                borderRadius: '20px', fontSize: '13px', fontWeight: '600'
              }}>{typeof service === 'string' ? service : service.name}</span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '4px', marginBottom: '24px',
          display: 'flex', gap: '4px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          {[
            { key: 'about', label: '📋 About' },
            { key: 'booking', label: '📅 Book Appointment' },
            { key: 'reviews', label: `⭐ Reviews (${reviews.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '12px',
                border: 'none', borderRadius: '12px',
                background: activeTab === tab.key ? 'linear-gradient(135deg, #db2777, #9d174d)' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#6b7280',
                fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px'}}>
              {salon.services.map((service, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: '16px',
                  padding: '24px', textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: '1px solid #fce7f3'
                }}>
                  <span style={{fontSize: '40px'}}>💅</span>
                  <p style={{fontWeight: '700', marginTop: '12px', color: '#1f2937', fontFamily: "'Playfair Display', serif"}}>
                    {typeof service === 'string' ? service : service.name}
                  </p>
                  <p style={{color: '#db2777', fontWeight: '700', fontSize: '18px', marginTop: '4px'}}>
                    {typeof service === 'string' ? '' : `Rs. ${service.price}`}
                  </p>
                </div>
              ))}
            </div>
            <div style={{background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}>
              <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '16px', color: '#1f2937'}}>Salon Information</h3>
              {[
                { icon: '📍', label: 'Location', value: salon.location },
                { icon: '🕐', label: 'Working Hours', value: salon.workingHours },
                { icon: '📞', label: 'Contact', value: salon.contactInfo },
                { icon: '💰', label: 'Price Range', value: salon.priceRange },
              ].map((item, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none'}}>
                  <span style={{fontSize: '20px'}}>{item.icon}</span>
                  <div>
                    <p style={{color: '#6b7280', fontSize: '12px', fontWeight: '600', letterSpacing: '1px'}}>{item.label.toUpperCase()}</p>
                    <p style={{fontWeight: '600', color: '#1f2937', marginTop: '2px'}}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            {salon.coordinates?.lat && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '16px', color: '#1f2937'}}>
                  📍 Location on Map
                </h3>
                <MapComponent
                  lat={salon.coordinates.lat}
                  lng={salon.coordinates.lng}
                  salonName={salon.name}
                  address={salon.address || salon.location}
                />
              </div>
            )}
          </div>
        )}

        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <div style={{background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '8px', color: '#1f2937'}}>Book an Appointment</h3>
            <p style={{color: '#6b7280', marginBottom: '24px'}}>Choose your service, date and time</p>

            {!user && (
              <div style={{background: '#fdf2f8', border: '1px solid #fce7f3', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'center'}}>
                <p style={{color: '#db2777', fontWeight: '600'}}>
                  Please <span onClick={() => navigate('/login')} style={{textDecoration: 'underline', cursor: 'pointer'}}>login</span> to book an appointment
                </p>
              </div>
            )}

            {bookingMsg && (
              <div style={{background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', textAlign: 'center'}}>{bookingMsg}</div>
            )}
            {bookingErr && (
              <div style={{background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', textAlign: 'center'}}>{bookingErr}</div>
            )}

            <form onSubmit={handleBooking}>
              {/* Service Selection */}
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151'}}>Select Service</label>
                <select
                  value={booking.service}
                  onChange={e => {
                    const selectedService = salon.services.find(s => (typeof s === 'string' ? s : s.name) === e.target.value);
                    setBooking({...booking, service: e.target.value});
                    if (selectedService && selectedService.price) setPaymentAmount(selectedService.price);
                  }}
                  required
                  style={{width: '100%', padding: '14px 16px', border: '2px solid #fce7f3', borderRadius: '12px', fontSize: '15px', outline: 'none', background: 'white'}}
                >
                  <option value="">Choose a service...</option>
                  {salon.services.map((s, i) => (
                    <option key={i} value={typeof s === 'string' ? s : s.name}>
                      {typeof s === 'string' ? s : `${s.name} — Rs. ${s.price}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto price display */}
              {booking.service && paymentAmount > 0 && (
                <div style={{
                  marginBottom: '20px', padding: '16px',
                  background: '#fdf2f8', borderRadius: '12px',
                  border: '2px solid #fce7f3',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <p style={{color: '#6b7280', fontSize: '13px', fontWeight: '600'}}>SERVICE PRICE</p>
                    <p style={{fontSize: '28px', fontWeight: '700', color: '#db2777', fontFamily: "'Playfair Display', serif"}}>
                      Rs. {paymentAmount}
                    </p>
                  </div>
                  <span style={{fontSize: '36px'}}>💅</span>
                </div>
              )}

              {/* Date */}
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151'}}>Select Date</label>
                <input
                  type="date"
                  value={booking.date}
                  onChange={e => setBooking({...booking, date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{width: '100%', padding: '14px 16px', border: '2px solid #fce7f3', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box'}}
                />
              </div>

              {/* Time Slots */}
              <div style={{marginBottom: '28px'}}>
                <label style={{display: 'block', marginBottom: '12px', fontWeight: '700', color: '#374151'}}>Select Time Slot</label>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
                  {timeSlots.map((slot, i) => (
                    <button
                      key={i} type="button"
                      onClick={() => setBooking({...booking, timeSlot: slot})}
                      style={{
                        padding: '12px 8px',
                        border: '2px solid',
                        borderColor: booking.timeSlot === slot ? '#db2777' : '#fce7f3',
                        background: booking.timeSlot === slot ? 'linear-gradient(135deg, #db2777, #9d174d)' : 'white',
                        color: booking.timeSlot === slot ? 'white' : '#6b7280',
                        borderRadius: '12px', cursor: 'pointer',
                        fontWeight: '700', fontSize: '13px',
                        transition: 'all 0.3s'
                      }}
                    >{slot}</button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%', padding: '16px',
                  background: 'linear-gradient(135deg, #db2777, #9d174d)',
                  color: 'white', border: 'none',
                  borderRadius: '12px', fontSize: '16px',
                  fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(219,39,119,0.4)'
                }}
              >
                Confirm Booking 💅
              </button>
            </form>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            {user && (
              <div style={{background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '20px'}}>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '16px', color: '#1f2937'}}>Leave a Review</h3>
                {reviewMsg && <div style={{background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontWeight: '600'}}>{reviewMsg}</div>}
                <form onSubmit={handleReview}>
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151'}}>Rating</label>
                    <select
                      value={review.rating}
                      onChange={e => setReview({...review, rating: e.target.value})}
                      style={{width: '100%', padding: '12px 16px', border: '2px solid #fce7f3', borderRadius: '12px', fontSize: '15px', outline: 'none'}}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                      <option value="3">⭐⭐⭐ 3 - Good</option>
                      <option value="2">⭐⭐ 2 - Fair</option>
                      <option value="1">⭐ 1 - Poor</option>
                    </select>
                  </div>
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151'}}>Comment</label>
                    <textarea
                      value={review.comment}
                      onChange={e => setReview({...review, comment: e.target.value})}
                      placeholder="Share your experience..."
                      rows="3"
                      style={{width: '100%', padding: '12px 16px', border: '2px solid #fce7f3', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical'}}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 28px',
                      background: 'linear-gradient(135deg, #db2777, #9d174d)',
                      color: 'white', border: 'none',
                      borderRadius: '25px', cursor: 'pointer',
                      fontWeight: '700', fontSize: '14px'
                    }}
                  >Submit Review ⭐</button>
                </form>
              </div>
            )}

            {reviews.length === 0 ? (
              <div style={{background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}>
                <p style={{fontSize: '48px'}}>⭐</p>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '22px', marginTop: '16px', color: '#1f2937'}}>No reviews yet</h3>
                <p style={{color: '#6b7280', marginTop: '8px'}}>Be the first to review this salon!</p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {reviews.map((r, i) => (
                  <div key={i} style={{background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #fce7f3'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #db2777, #9d174d)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: '700', fontSize: '16px'
                        }}>
                          {r.customer?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p style={{fontWeight: '700', color: '#1f2937'}}>{r.customer?.name || 'Customer'}</p>
                          <p style={{color: '#6b7280', fontSize: '12px'}}>{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={{background: '#fffbeb', padding: '6px 14px', borderRadius: '20px'}}>
                        <span style={{color: '#f59e0b'}}>{'⭐'.repeat(r.rating)}</span>
                      </div>
                    </div>
                    <p style={{color: '#374151', marginTop: '12px', lineHeight: '1.6'}}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      {/* Payment Modal */}
      {showPayment && clientSecret && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999,
          padding: '20px'
        }}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              clientSecret={clientSecret}
              bookingId={savedBookingId}
              amount={paymentAmount}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default SalonProfile;
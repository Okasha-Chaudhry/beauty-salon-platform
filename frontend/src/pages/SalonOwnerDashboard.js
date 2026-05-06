import ImageUpload from '../components/ImageUpload';
import AddressSearch from '../components/AddressSearch';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const SalonOwnerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [activeTab, setActiveTab] = useState('overview');
  const [salon, setSalon] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSalon, setHasSalon] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [salonForm, setSalonForm] = useState({
    name: '', description: '', location: '',
      address: '', // 👈 ADD
      coordinates: { lat: null, lng: null }, // 👈 ADD
    priceRange: '', contactInfo: '', workingHours: '', services: [{ name: '', price: 0 }]
  });

  useEffect(() => {
    if (!user || user.role !== 'salon_owner') { navigate('/'); return; }
    fetchData();
  // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const salonRes = await API.get('/salons/my-salon');
      setSalon(salonRes.data);
      setHasSalon(true);
         setSalonForm({
  ...salonRes.data,
  services: salonRes.data.services.length > 0
    ? salonRes.data.services.map(s =>
        typeof s === 'string'
          ? { name: s, price: 0 }  // convert old string format
          : s                        // keep new object format
      )
    : [{ name: '', price: 0 }]
});

    const bookingRes = await API.get(`/bookings/salon/${salonRes.data._id}`);
    setBookings(bookingRes.data);

      const reviewRes = await API.get(`/reviews/${salonRes.data._id}`);
      setReviews(reviewRes.data);

    } catch (err) {
      if (err.response?.status === 404) setHasSalon(false);
    }
    setLoading(false);
  };

   const handleUpdateSalon = async (e) => {
  e.preventDefault();
  try {
    const updateData = {
      name: salonForm.name,
      description: salonForm.description,
      location: salonForm.location,
      address: salonForm.address,
      coordinates: salonForm.coordinates,
      priceRange: salonForm.priceRange,
      contactInfo: salonForm.contactInfo,
      workingHours: salonForm.workingHours,
      services: salonForm.services.filter(s => s.name.trim() !== ''),
    };
    const updated = await API.put(`/salons/${salon._id}`, updateData);
    setSalon(updated.data);
    setEditMode(false);
    setSaveMsg('✅ Salon updated successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
  } catch (err) {
    console.error('Update error:', err.response?.data || err.message);
    setSaveMsg('❌ ' + (err.response?.data?.message || err.message));
  }
};

  const handleCreateSalon = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/salons', {
        ...salonForm,
        services: salonForm
      });
      setSalon(res.data);
      setHasSalon(true);
      setSaveMsg('✅ Salon created successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
      fetchData();
    } catch (err) {
      setSaveMsg('❌ Failed to create salon');
    }
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

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '2px solid #fce7f3', borderRadius: '12px',
    fontSize: '15px', outline: 'none',
    boxSizing: 'border-box', fontFamily: "'Inter', sans-serif"
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '48px' }}>💄</p>
        <p style={{ color: '#6b7280', marginTop: '16px', fontSize: '18px' }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  // No salon yet — show create form
  if (!hasSalon) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 32px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #db2777, #9d174d)',
          borderRadius: '20px', padding: '40px', color: 'white',
          textAlign: 'center', marginBottom: '32px'
        }}>
          <p style={{ fontSize: '56px' }}>💄</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', marginTop: '12px' }}>
            Welcome, {user?.name}!
          </h1>
          <p style={{ opacity: 0.85, marginTop: '8px', fontSize: '16px' }}>
            You don't have a salon listed yet. Create one now!
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '24px', color: '#1f2937' }}>
            Create Your Salon
          </h2>

          {saveMsg && (
            <div style={{
              background: saveMsg.includes('✅') ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${saveMsg.includes('✅') ? '#86efac' : '#fca5a5'}`,
              color: saveMsg.includes('✅') ? '#16a34a' : '#dc2626',
              padding: '12px', borderRadius: '12px', marginBottom: '20px',
              fontWeight: '600', textAlign: 'center'
            }}>{saveMsg}</div>
          )}

          <form onSubmit={handleCreateSalon}>
            {[
  { label: 'Salon Name', key: 'name', placeholder: 'e.g. Glamour Studio' },
  { label: 'Description', key: 'description', placeholder: 'Describe your salon...' },
  { label: 'Price Range', key: 'priceRange', placeholder: 'e.g. Rs. 500 - 3000' },
  { label: 'Contact Info', key: 'contactInfo', placeholder: 'e.g. 0300-1234567' },
  { label: 'Working Hours', key: 'workingHours', placeholder: 'e.g. 9am - 8pm' },
].map((field, i) => (
  <div key={i} style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
      {field.label}
    </label>
    <input
      type="text"
      value={salonForm[field.key]}
      onChange={e => setSalonForm({ ...salonForm, [field.key]: e.target.value })}
      placeholder={field.placeholder}
      required
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = '#db2777'}
      onBlur={e => e.target.style.borderColor = '#fce7f3'}
    />
  </div>
))}

{/* 👇 ADDRESS SEARCH — ADD HERE */}
<div style={{ marginBottom: '16px' }}>
  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
    📍 Full Address
  </label>
  <AddressSearch
    defaultValue={salonForm.address}
    onAddressSelect={({ address, lat, lng }) => {
      setSalonForm({
        ...salonForm,
        address: address,
        location: address.split(',').slice(0, 2).join(','),
        coordinates: { lat, lng }
      });
    }}
  />
  {salonForm.coordinates?.lat && (
    <p style={{ color: '#16a34a', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>
      ✅ Location selected: {salonForm.coordinates.lat.toFixed(4)}, {salonForm.coordinates.lng.toFixed(4)}
    </p>
  )}
</div>

{/* Services with Prices */}
<div style={{ marginBottom: '16px' }}>
  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
    💅 Services & Prices
  </label>
  {salonForm.services.map((service, index) => (
    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Service name e.g. Haircut"
        value={service.name}
        onChange={e => {
          const updated = [...salonForm.services];
          updated[index].name = e.target.value;
          setSalonForm({ ...salonForm, services: updated });
        }}
        style={{ ...inputStyle, flex: 2 }}
        onFocus={e => e.target.style.borderColor = '#db2777'}
        onBlur={e => e.target.style.borderColor = '#fce7f3'}
      />
      <input
        type="number"
        placeholder="Price Rs."
        value={service.price}
        onChange={e => {
          const updated = [...salonForm.services];
          updated[index].price = Number(e.target.value);
          setSalonForm({ ...salonForm, services: updated });
        }}
        style={{ ...inputStyle, flex: 1 }}
        onFocus={e => e.target.style.borderColor = '#db2777'}
        onBlur={e => e.target.style.borderColor = '#fce7f3'}
      />
      <button
        type="button"
        onClick={() => {
          const updated = salonForm.services.filter((_, i) => i !== index);
          setSalonForm({ ...salonForm, services: updated });
        }}
        style={{
          padding: '10px 14px', background: '#fef2f2',
          border: '1px solid #fca5a5', color: '#dc2626',
          borderRadius: '10px', cursor: 'pointer',
          fontWeight: '700', fontSize: '16px'
        }}
      >✕</button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => setSalonForm({
      ...salonForm,
      services: [...salonForm.services, { name: '', price: 0 }]
    })}
    style={{
      padding: '10px 20px', background: '#fdf2f8',
      border: '2px dashed #db2777', color: '#db2777',
      borderRadius: '12px', cursor: 'pointer',
      fontWeight: '700', fontSize: '14px', width: '100%',
      marginTop: '8px'
    }}
  >+ Add Service</button>
</div>
            <button type="submit" style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #db2777, #9d174d)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(219,39,119,0.4)'
            }}>
              Create My Salon 💄
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
        padding: '40px 32px', color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#fce7f3', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px', marginBottom: '8px' }}>
            Salon Owner Portal
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', fontWeight: '700', marginBottom: '8px' }}>
            💄 {salon?.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>
            Welcome back, {user?.name}! Manage your salon from here.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Bookings', value: bookings.length, icon: '📅', color: '#fdf2f8', border: '#fce7f3' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: '⏳', color: '#fffbeb', border: '#fde68a' },
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: '✅', color: '#f0fdf4', border: '#bbf7d0' },
            { label: 'Total Reviews', value: reviews.length, icon: '⭐', color: '#fffbeb', border: '#fde68a' },
          ].map((card, i) => (
            <div key={i} style={{
              background: card.color, borderRadius: '20px', padding: '24px',
              border: `1px solid ${card.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>{card.label}</p>
                  <p style={{ fontSize: '40px', fontWeight: '700', color: '#db2777', marginTop: '8px', fontFamily: "'Playfair Display', serif" }}>{card.value}</p>
                </div>
                <span style={{ fontSize: '36px' }}>{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '4px',
          marginBottom: '24px', display: 'flex', gap: '4px', flexWrap: 'wrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'salon', label: '💄 My Salon' },
            { key: 'bookings', label: '📅 Bookings' },
            { key: 'reviews', label: '⭐ Reviews' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: '12px 16px', border: 'none', borderRadius: '12px',
              background: activeTab === tab.key ? 'linear-gradient(135deg, #db2777, #9d174d)' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              fontWeight: '700', fontSize: '14px', cursor: 'pointer',
              transition: 'all 0.3s', minWidth: '100px'
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '20px', color: '#1f2937' }}>
                Recent Bookings
              </h3>
              {bookings.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>No bookings yet 📭</p>
              ) : bookings.slice(0, 5).map((b, i) => {
                const s = getStatusStyle(b.status);
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px', borderRadius: '12px', background: '#f9fafb',
                    marginBottom: '10px', flexWrap: 'wrap', gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #db2777, #9d174d)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: '700'
                      }}>{b.customer?.name?.charAt(0).toUpperCase() || 'U'}</div>
                      <div>
                        <p style={{ fontWeight: '700', color: '#1f2937' }}>{b.customer?.name}</p>
                        <p style={{ color: '#6b7280', fontSize: '13px' }}>💅 {b.service} — {b.timeSlot}</p>
                        <p style={{ color: '#9ca3af', fontSize: '12px' }}>📅 {new Date(b.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span style={{
                      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                      padding: '4px 14px', borderRadius: '20px', fontWeight: '700',
                      fontSize: '13px', textTransform: 'capitalize'
                    }}>{b.status}</span>
                  </div>
                );
              })}
            </div>

            {/* Recent Reviews */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '20px', color: '#1f2937' }}>
                Recent Reviews
              </h3>
              {reviews.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>No reviews yet ⭐</p>
              ) : reviews.slice(0, 3).map((r, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '12px', background: '#f9fafb', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: '700', color: '#1f2937' }}>{r.customer?.name}</p>
                    <span style={{ color: '#f59e0b' }}>{'⭐'.repeat(r.rating)}</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Salon Tab */}
        {activeTab === 'salon' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#1f2937' }}>My Salon Details</h3>
              <button onClick={() => setEditMode(!editMode)} style={{
                padding: '10px 24px',
                background: editMode ? '#f3f4f6' : 'linear-gradient(135deg, #db2777, #9d174d)',
                color: editMode ? '#374151' : 'white',
                border: 'none', borderRadius: '25px',
                fontWeight: '700', cursor: 'pointer', fontSize: '14px'
              }}>{editMode ? '✕ Cancel' : '✏️ Edit'}</button>
            </div>

            {saveMsg && (
              <div style={{
                background: saveMsg.includes('✅') ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${saveMsg.includes('✅') ? '#86efac' : '#fca5a5'}`,
                color: saveMsg.includes('✅') ? '#16a34a' : '#dc2626',
                padding: '12px', borderRadius: '12px', marginBottom: '20px',
                fontWeight: '600', textAlign: 'center'
              }}>{saveMsg}</div>
            )}

            {editMode ? (
              <form onSubmit={handleUpdateSalon}>
                     {[
  { label: 'Salon Name', key: 'name' },
  { label: 'Description', key: 'description' },
  { label: 'Price Range', key: 'priceRange' },
  { label: 'Contact Info', key: 'contactInfo' },
  { label: 'Working Hours', key: 'workingHours' },
].map((field, i) => (
  <div key={i} style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
      {field.label}
    </label>
    <input
      type="text"
      value={salonForm[field.key] || ''}
      onChange={e => setSalonForm({ ...salonForm, [field.key]: e.target.value })}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = '#db2777'}
      onBlur={e => e.target.style.borderColor = '#fce7f3'}
    />
  </div>
))}

{/* 👇 ADDRESS SEARCH — ADD HERE */}
<div style={{ marginBottom: '16px' }}>
  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
    📍 Full Address
  </label>
  <AddressSearch
    defaultValue={salonForm.address}
    onAddressSelect={({ address, lat, lng }) => {
      setSalonForm({
        ...salonForm,
        address: address,
        location: address.split(',').slice(0, 2).join(','),
        coordinates: { lat, lng }
      });
    }}
  />
  {salonForm.coordinates?.lat && (
    <p style={{ color: '#16a34a', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>
      ✅ Location selected: {salonForm.coordinates.lat.toFixed(4)}, {salonForm.coordinates.lng.toFixed(4)}
    </p>
  )}
</div>

{/* Services with Prices */}
<div style={{ marginBottom: '16px' }}>
  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
    💅 Services & Prices
  </label>
  {salonForm.services.map((service, index) => (
    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Service name e.g. Haircut"
        value={service.name}
        onChange={e => {
          const updated = [...salonForm.services];
          updated[index].name = e.target.value;
          setSalonForm({ ...salonForm, services: updated });
        }}
        style={{ ...inputStyle, flex: 2 }}
        onFocus={e => e.target.style.borderColor = '#db2777'}
        onBlur={e => e.target.style.borderColor = '#fce7f3'}
      />
      <input
        type="number"
        placeholder="Price Rs."
        value={service.price}
        onChange={e => {
          const updated = [...salonForm.services];
          updated[index].price = Number(e.target.value);
          setSalonForm({ ...salonForm, services: updated });
        }}
        style={{ ...inputStyle, flex: 1 }}
        onFocus={e => e.target.style.borderColor = '#db2777'}
        onBlur={e => e.target.style.borderColor = '#fce7f3'}
      />
      <button
        type="button"
        onClick={() => {
          const updated = salonForm.services.filter((_, i) => i !== index);
          setSalonForm({ ...salonForm, services: updated });
        }}
        style={{
          padding: '10px 14px', background: '#fef2f2',
          border: '1px solid #fca5a5', color: '#dc2626',
          borderRadius: '10px', cursor: 'pointer',
          fontWeight: '700', fontSize: '16px'
        }}
      >✕</button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => setSalonForm({
      ...salonForm,
      services: [...salonForm.services, { name: '', price: 0 }]
    })}
    style={{
      padding: '10px 20px', background: '#fdf2f8',
      border: '2px dashed #db2777', color: '#db2777',
      borderRadius: '12px', cursor: 'pointer',
      fontWeight: '700', fontSize: '14px', width: '100%',
      marginTop: '8px'
    }}
  >+ Add Service</button>
</div>
{/* Image Upload */}
{salon && (
  <ImageUpload
    salonId={salon._id}
    existingImages={salon.images || []}
    onImagesUpdated={(newImages) => setSalon({...salon, images: newImages})}
  />
)}
<button type="submit" style={{
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, #db2777, #9d174d)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(219,39,119,0.4)'
                }}>Save Changes ✅</button>
              </form>
            ) : (
              <div>
                {[
                  { icon: '💄', label: 'Salon Name', value: salon?.name },
                  { icon: '📝', label: 'Description', value: salon?.description },
                  { icon: '📍', label: 'Location', value: salon?.location },
                  { icon: '💰', label: 'Price Range', value: salon?.priceRange },
                  { icon: '📞', label: 'Contact', value: salon?.contactInfo },
                  { icon: '🕐', label: 'Working Hours', value: salon?.workingHours },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                    padding: '14px 0', borderBottom: i < 5 ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>{item.label.toUpperCase()}</p>
                      <p style={{ fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '14px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', marginBottom: '8px' }}>SERVICES</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {salon?.services?.map((s, i) => (
  <span key={i} style={{
    background: 'linear-gradient(135deg, #db2777, #9d174d)',
    color: 'white', padding: '6px 16px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '600'
  }}>
    {typeof s === 'string' ? s : `${s.name} — Rs. ${s.price}`}
  </span>
))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#1f2937', marginBottom: '20px' }}>
              Bookings ({bookings.length})
            </h3>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '48px' }}>📭</p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', marginTop: '16px' }}>No bookings yet</h3>
                <p style={{ color: '#6b7280', marginTop: '8px' }}>When customers book your salon, they'll appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookings.map((b, i) => {
                  const s = getStatusStyle(b.status);
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #db2777, #9d174d)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: '700', fontSize: '18px'
                          }}>{b.customer?.name?.charAt(0).toUpperCase() || 'U'}</div>
                          <div>
                            <p style={{ fontWeight: '700', fontSize: '16px', color: '#1f2937' }}>{b.customer?.name}</p>
                            <p style={{ color: '#6b7280', fontSize: '13px' }}>{b.customer?.email}</p>
                            <p style={{ marginTop: '4px', fontSize: '14px' }}>💅 <strong>{b.service}</strong></p>
                            <p style={{ color: '#6b7280', fontSize: '13px' }}>📅 {new Date(b.date).toLocaleDateString()} at {b.timeSlot}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                          <span style={{
                            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                            padding: '4px 14px', borderRadius: '20px',
                            fontWeight: '700', fontSize: '13px', textTransform: 'capitalize'
                          }}>{b.status}</span>
                          {b.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleUpdateBooking(b._id, 'confirmed')} style={{ padding: '6px 14px', background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>✓ Confirm</button>
                              <button onClick={() => handleUpdateBooking(b._id, 'cancelled')} style={{ padding: '6px 14px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>✗ Cancel</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#1f2937', marginBottom: '20px' }}>
              Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '48px' }}>⭐</p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', marginTop: '16px' }}>No reviews yet</h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.map((r, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #fce7f3' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #db2777, #9d174d)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: '700'
                        }}>{r.customer?.name?.charAt(0).toUpperCase() || 'U'}</div>
                        <div>
                          <p style={{ fontWeight: '700', color: '#1f2937' }}>{r.customer?.name}</p>
                          <p style={{ color: '#9ca3af', fontSize: '12px' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={{ background: '#fffbeb', padding: '6px 14px', borderRadius: '20px' }}>
                        <span style={{ color: '#f59e0b' }}>{'⭐'.repeat(r.rating)}</span>
                        <span style={{ fontWeight: '700', color: '#d97706', marginLeft: '6px' }}>{r.rating}/5</span>
                      </div>
                    </div>
                    <p style={{ color: '#374151', marginTop: '12px', lineHeight: '1.6', background: '#f9fafb', padding: '12px', borderRadius: '10px' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default SalonOwnerDashboard;
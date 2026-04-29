import React, { useState, useEffect } from 'react';
import { getSalons } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating }) => {
  const avg = rating && rating.length > 0
    ? (rating.reduce((a, b) => a + b, 0) / rating.length).toFixed(1)
    : null;
  return avg ? (
    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
      <span style={{color: '#f59e0b', fontSize: '14px'}}>{'⭐'.repeat(Math.round(avg))}</span>
      <span style={{fontWeight: '600', fontSize: '14px'}}>{avg}</span>
    </div>
  ) : <span style={{color: 'gray', fontSize: '13px'}}>No ratings yet</span>;
};

const HomePage = () => {
  const [salons, setSalons] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const navigate = useNavigate();

  const services = ['All', 'Haircut', 'Facial', 'Manicure', 'Pedicure', 'Makeup', 'Bridal'];
  const prices = ['All', 'Budget (< Rs.1000)', 'Mid (Rs.1000-3000)', 'Premium (> Rs.3000)'];

  useEffect(() => {
    getSalons()
      .then(res => { setSalons(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = salons.filter(salon => {
    const matchSearch = salon.name.toLowerCase().includes(search.toLowerCase()) ||
      salon.location.toLowerCase().includes(search.toLowerCase());
    const matchService = selectedService === 'All' ||
      salon.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
    return matchSearch && matchService;
  });

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
        padding: '80px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}}/>
        <div style={{position: 'relative', zIndex: 1}}>
          <p style={{color: '#fce7f3', fontSize: '16px', fontWeight: '500', marginBottom: '12px', letterSpacing: '2px', textTransform: 'uppercase'}}>
            ✨ Pakistan's #1 Beauty Platform
          </p>
          <h1 style={{
            color: 'white', fontSize: '52px', fontWeight: '700',
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.2', marginBottom: '20px'
          }}>
            Find Your Perfect<br/>
            <span style={{color: '#fce7f3'}}>Beauty Salon</span> 💅
          </h1>
          <p style={{color: 'rgba(255,255,255,0.85)', fontSize: '18px', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px'}}>
            Book appointments with top-rated beauty salons near you. Quick, easy, and hassle-free.
          </p>

          {/* Search Bar */}
          <div style={{
            display: 'flex', maxWidth: '600px', margin: '0 auto',
            background: 'white', borderRadius: '50px',
            padding: '6px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <input
              type="text"
              placeholder="🔍 Search salons by name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none',
                padding: '12px 20px', fontSize: '16px',
                borderRadius: '50px', background: 'transparent'
              }}
            />
            <button style={{
              background: 'linear-gradient(135deg, #db2777, #9d174d)',
              color: 'white', border: 'none',
              padding: '12px 32px', borderRadius: '50px',
              fontWeight: '700', fontSize: '15px', cursor: 'pointer'
            }}>
              Search
            </button>
          </div>

          {/* Stats */}
          <div style={{display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', flexWrap: 'wrap'}}>
            {[
              { number: salons.length + '+', label: 'Salons Listed' },
              { number: '500+', label: 'Happy Customers' },
              { number: '4.8★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} style={{textAlign: 'center'}}>
                <p style={{color: 'white', fontSize: '28px', fontWeight: '700', fontFamily: "'Playfair Display', serif"}}>{stat.number}</p>
                <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px'}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={{padding: '60px 32px', background: 'white', textAlign: 'center'}}>
        <p style={{color: '#db2777', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px'}}>Simple Process</p>
        <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '36px', marginBottom: '40px', color: '#1f2937'}}>
          How It Works
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto'}}>
          {[
            { step: '01', icon: '🔍', title: 'Search', desc: 'Find salons by location or service type' },
            { step: '02', icon: '👀', title: 'Browse', desc: 'View profiles, reviews and pricing' },
            { step: '03', icon: '📅', title: 'Book', desc: 'Pick your date, time and service' },
            { step: '04', icon: '💅', title: 'Enjoy', desc: 'Visit the salon and look amazing!' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '32px 24px', borderRadius: '16px',
              background: '#fdf2f8', textAlign: 'center',
              border: '1px solid #fce7f3'
            }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #db2777, #9d174d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: '24px'
              }}>{item.icon}</div>
              <p style={{color: '#db2777', fontWeight: '700', fontSize: '12px', letterSpacing: '2px', marginBottom: '8px'}}>STEP {item.step}</p>
              <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '8px'}}>{item.title}</h3>
              <p style={{color: '#6b7280', fontSize: '14px', lineHeight: '1.5'}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters + Salons */}
      <div style={{padding: '60px 32px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <p style={{color: '#db2777', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px'}}>Discover</p>
            <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#1f2937'}}>Featured Salons</h2>
          </div>
          <p style={{color: '#6b7280'}}>{filtered.length} salons found</p>
        </div>

        {/* Service Filters */}
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px'}}>
          {services.map((service, i) => (
            <button
              key={i}
              onClick={() => setSelectedService(service)}
              style={{
                padding: '8px 20px', borderRadius: '25px', border: '2px solid',
                borderColor: selectedService === service ? '#db2777' : '#fce7f3',
                backgroundColor: selectedService === service ? '#db2777' : 'white',
                color: selectedService === service ? 'white' : '#db2777',
                fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {service}
            </button>
          ))}
        </div>

        {/* Salon Grid */}
        {loading ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'}}>
            {[1,2,3].map(i => (
              <div key={i} style={{height: '300px', background: '#fce7f3', borderRadius: '16px', animation: 'pulse 2s infinite'}}/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '80px', background: '#fdf2f8', borderRadius: '16px'}}>
            <p style={{fontSize: '48px'}}>🔍</p>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '24px', marginTop: '16px'}}>No salons found</h3>
            <p style={{color: '#6b7280', marginTop: '8px'}}>Try a different search or filter</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px'}}>
            {filtered.map(salon => (
              <div
                key={salon._id}
                onClick={() => navigate(`/salon/${salon._id}`)}
                style={{
                  background: 'white', borderRadius: '20px',
                  overflow: 'hidden', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  border: '1px solid #fce7f3'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(219,39,119,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
              >
                {/* Salon Image Placeholder */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #fce7f3, #db2777)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}>
                  <span style={{fontSize: '64px'}}>💄</span>
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'white', borderRadius: '20px',
                    padding: '4px 12px', fontSize: '13px', fontWeight: '600', color: '#db2777'
                  }}>
                    {salon.priceRange}
                  </div>
                </div>

                <div style={{padding: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <h3 style={{
                      color: '#1f2937', fontSize: '20px', fontWeight: '700',
                      fontFamily: "'Playfair Display', serif"
                    }}>{salon.name}</h3>
                    <StarRating rating={salon.ratings} />
                  </div>
                  <p style={{color: '#6b7280', marginTop: '6px', fontSize: '14px'}}>📍 {salon.location}</p>
                  <p style={{color: '#6b7280', marginTop: '4px', fontSize: '14px', lineHeight: '1.5'}}>{salon.description}</p>

                  <div style={{marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                   {salon.services.slice(0, 3).map((service, i) => (
                   <span key={i} style={{
                    backgroundColor: '#fdf2f8', color: '#db2777',
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: '600'
                   }}>
                   {service.name} — Rs.{service.price}
                  </span>
                   ))}
                    {salon.services.length > 3 && (
                      <span style={{color: '#6b7280', fontSize: '12px', padding: '4px 8px'}}>+{salon.services.length - 3} more</span>
                    )}
                  </div>

                  <div style={{
                    marginTop: '16px', paddingTop: '16px',
                    borderTop: '1px solid #fce7f3',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{color: '#6b7280', fontSize: '13px'}}>🕐 {salon.workingHours}</span>
                    <button style={{
                      background: 'linear-gradient(135deg, #db2777, #9d174d)',
                      color: 'white', border: 'none',
                      padding: '8px 20px', borderRadius: '20px',
                      fontWeight: '600', fontSize: '13px', cursor: 'pointer'
                    }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #db2777, #9d174d)',
        padding: '80px 32px', textAlign: 'center', margin: '40px 0 0'
      }}>
        <h2 style={{
          color: 'white', fontSize: '40px',
          fontFamily: "'Playfair Display', serif", marginBottom: '16px'
        }}>
          Own a Beauty Salon?
        </h2>
        <p style={{color: 'rgba(255,255,255,0.85)', fontSize: '18px', marginBottom: '32px'}}>
          List your salon for free and reach thousands of customers!
        </p>
        <button
          onClick={() => window.location.href = '/register'}
          style={{
            background: 'white', color: '#db2777',
            border: 'none', padding: '16px 40px',
            borderRadius: '50px', fontWeight: '700',
            fontSize: '16px', cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
        >
          List Your Salon Free →
        </button>
      </div>
    </div>
  );
};

export default HomePage;
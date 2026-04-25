import React, { useState, useEffect } from 'react';
import { getSalons } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [salons, setSalons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSalons()
      .then((res) => {
        setSalons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = salons.filter(salon =>
    salon.name.toLowerCase().includes(search.toLowerCase()) ||
    salon.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{padding: '24px'}}>
      {/* Hero Section */}
      <div style={{textAlign: 'center', marginBottom: '32px'}}>
        <h2 style={{color: '#db2777', fontSize: '32px', fontWeight: 'bold'}}>
          Find Your Perfect Salon 💅
        </h2>
        <p style={{color: 'gray', marginTop: '8px'}}>
          Book appointments with the best beauty salons near you
        </p>
      </div>

      {/* Search Bar */}
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '32px'}}>
        <input
          type="text"
          placeholder="Search salons by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: '2px solid #db2777',
            padding: '12px',
            width: '500px',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Salons Grid */}
      <h3 style={{fontSize: '24px', fontWeight: '600', marginBottom: '16px'}}>
        Featured Salons
      </h3>

      {loading ? (
        <p style={{color: 'gray'}}>Loading salons...</p>
      ) : filtered.length === 0 ? (
        <p style={{color: 'gray'}}>No salons found yet. Check back soon!</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filtered.map((salon) => (
            <div
              key={salon._id}
              onClick={() => navigate(`/salon/${salon._id}`)}
              style={{
                border: '1px solid #fce7f3',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h4 style={{color: '#db2777', fontSize: '20px', fontWeight: 'bold'}}>
                {salon.name}
              </h4>
              <p style={{color: 'gray', marginTop: '8px'}}>📍 {salon.location}</p>
              <p style={{color: 'gray', marginTop: '4px'}}>💰 {salon.priceRange}</p>
              <p style={{color: '#333', marginTop: '8px'}}>{salon.description}</p>
              <div style={{marginTop: '12px'}}>
                {salon.services.map((service, i) => (
                  <span key={i} style={{
                    backgroundColor: '#fce7f3',
                    color: '#db2777',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    marginRight: '6px',
                    display: 'inline-block',
                    marginTop: '4px'
                  }}>
                    {service}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
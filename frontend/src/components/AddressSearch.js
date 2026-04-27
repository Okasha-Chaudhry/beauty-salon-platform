import React, { useState, useRef } from 'react';

const AddressSearch = ({ onAddressSelect, defaultValue }) => {
  const [query, setQuery] = useState(defaultValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const searchAddress = async (value) => {
    if (value.length < 3) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=pk&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Address search error:', err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddress(value), 500);
  };

  const handleSelect = (suggestion) => {
    const address = suggestion.display_name;
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setQuery(address);
    setSuggestions([]);
    onAddressSelect({ address, lat, lng });
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="🔍 Search full address e.g. Model Town, Lahore..."
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
        {loading && (
          <span style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)', fontSize: '16px'
          }}>⏳</span>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'white', borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          zIndex: 1000, maxHeight: '250px', overflowY: 'auto',
          border: '1px solid #fce7f3', marginTop: '4px'
        }}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => handleSelect(s)}
              style={{
                padding: '12px 16px', cursor: 'pointer',
                borderBottom: i < suggestions.length - 1 ? '1px solid #fce7f3' : 'none',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#fdf2f8'}
              onMouseOut={e => e.currentTarget.style.background = 'white'}
            >
              <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px', margin: 0 }}>
                📍 {s.display_name.split(',')[0]}
              </p>
              <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
                {s.display_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
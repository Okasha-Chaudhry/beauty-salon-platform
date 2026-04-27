import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ lat, lng, salonName, address }) => {
  if (!lat || !lng) return null;

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid #fce7f3' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: '300px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#db2777' }}>💄 {salonName}</strong>
              <br />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{address}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Get Directions Button */}
      <div style={{
        padding: '12px 16px',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{ fontWeight: '700', color: '#1f2937', fontSize: '14px' }}>📍 {salonName}</p>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{address}</p>
        </div>
        
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(135deg, #db2777, #9d174d)',
            color: 'white', padding: '8px 16px',
            borderRadius: '20px', textDecoration: 'none',
            fontWeight: '700', fontSize: '13px',
            whiteSpace: 'nowrap'
          }}
        >
          🗺️ Get Directions
        </a>
      </div>
    </div>
  );
};

export default MapComponent;
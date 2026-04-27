import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      color: 'white',
      padding: '60px 32px 30px',
      marginTop: '80px'
    }}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px'}}>

          {/* Brand */}
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
              <span style={{fontSize: '24px'}}>💄</span>
              <span style={{fontSize: '20px', fontWeight: '700', fontFamily: "'Playfair Display', serif", color: '#f9a8d4'}}>
                GlamourFind
              </span>
            </div>
            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6'}}>
              Connecting you with the best beauty salons in your city.
            </p>
            <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <span key={i} style={{
                  width: '36px', height: '36px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '16px'
                }}>{icon}</span>
              ))}
            </div>
          </div>

   {/* Quick Links */}
<div>
  <h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '16px', color: '#f9a8d4'}}>
    Quick Links
  </h4>
  {['Home', 'Find Salons', 'My Bookings', 'Contact Us', 'About Us'].map((link, i) => (
    <p key={i}
      style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '10px', cursor: 'pointer'}}
      onClick={() => navigate(
        i === 0 ? '/' :
        i === 1 ? '/' :
        i === 2 ? '/my-bookings' :
        i === 3 ? '/contact' :
        '/about'
          )}>
         → {link}
        </p>
       ))}
     </div>

          {/* Services */}
          <div>
            <h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '16px', color: '#f9a8d4'}}>
              Services
            </h4>
            {['Haircut & Styling', 'Facial & Skincare', 'Manicure & Pedicure', 'Bridal Makeup', 'Hair Coloring'].map((s, i) => (
              <p key={i} style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '10px'}}>→ {s}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '16px', color: '#f9a8d4'}}>
              Contact
            </h4>
            {[
              { icon: '📍', text: 'Multan, Punjab, Pakistan' },
              { icon: '📞', text: '+92 300 1234567' },
              { icon: '✉️', text: 'hello@glamourfind.com' },
              { icon: '🕐', text: 'Mon-Sat: 9am - 8pm' },
            ].map((item, i) => (
              <div key={i} style={{display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start'}}>
                <span>{item.icon}</span>
                <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>{item.text}</p>
              </div>
            ))}
            <button
              onClick={() => navigate('/contact')}
              style={{
                marginTop: '12px',
                background: 'linear-gradient(135deg, #db2777, #9d174d)',
                color: 'white', border: 'none',
                padding: '10px 20px', borderRadius: '20px',
                cursor: 'pointer', fontWeight: '700',
                fontSize: '13px'
              }}
            >
              📨 Contact Us
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <p style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>
            © 2026 GlamourFind by Okasha Chaudhry. All rights reserved.
          </p>
          <div style={{display: 'flex', gap: '20px'}}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
              <span key={i} style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer'}}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
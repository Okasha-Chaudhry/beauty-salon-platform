import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb'}}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
        padding: '80px 32px', textAlign: 'center', color: 'white',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}}/>
        <div style={{position: 'relative', zIndex: 1}}>
          <p style={{color: '#fce7f3', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px', marginBottom: '12px'}}>Our Story</p>
          <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: '52px', fontWeight: '700', marginBottom: '16px'}}>About GlamourFind</h1>
          <p style={{fontSize: '18px', opacity: 0.85, maxWidth: '600px', margin: '0 auto'}}>
            Pakistan's first and fastest growing beauty salon booking platform, connecting customers with top-rated salons.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div style={{maxWidth: '1100px', margin: '0 auto', padding: '80px 32px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '80px'}}>
          <div>
            <p style={{color: '#db2777', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px', marginBottom: '12px'}}>Our Mission</p>
            <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#1f2937', marginBottom: '20px', lineHeight: '1.2'}}>
              Making Beauty Accessible to Everyone
            </h2>
            <p style={{color: '#6b7280', fontSize: '16px', lineHeight: '1.8', marginBottom: '16px'}}>
              GlamourFind was founded with a simple vision — to make it easy for everyone in Pakistan to discover, book, and enjoy professional beauty services without the hassle of calling around or waiting in lines.
            </p>
            <p style={{color: '#6b7280', fontSize: '16px', lineHeight: '1.8', marginBottom: '24px'}}>
              We believe every person deserves to feel beautiful and confident, and every salon deserves to reach more customers. Our platform bridges that gap seamlessly.
            </p>
            <button
              onClick={() => navigate('/contact')}
              style={{
                background: 'linear-gradient(135deg, #db2777, #9d174d)',
                color: 'white', border: 'none',
                padding: '14px 32px', borderRadius: '25px',
                fontWeight: '700', fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(219,39,119,0.4)'
              }}
            >
              Get In Touch →
            </button>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
            borderRadius: '24px', padding: '48px',
            textAlign: 'center',
            border: '1px solid #fce7f3'
          }}>
            <span style={{fontSize: '80px'}}>💄</span>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#db2777', marginTop: '16px'}}>
              GlamourFind
            </h3>
            <p style={{color: '#6b7280', marginTop: '8px', fontSize: '16px'}}>Beauty at your fingertips</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '32px'}}>
              {[
                { number: '1+', label: 'Salons' },
                { number: '500+', label: 'Customers' },
                { number: '4.8★', label: 'Rating' },
              ].map((stat, i) => (
                <div key={i} style={{textAlign: 'center'}}>
                  <p style={{fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: '#db2777'}}>{stat.number}</p>
                  <p style={{color: '#6b7280', fontSize: '13px', marginTop: '4px'}}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <p style={{color: '#db2777', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px', marginBottom: '12px'}}>What We Stand For</p>
          <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#1f2937'}}>Our Core Values</h2>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '80px'}}>
          {[
            { icon: '🌟', title: 'Excellence', desc: 'We partner only with verified, high-quality salons that meet our strict standards.' },
            { icon: '🔒', title: 'Trust & Safety', desc: 'Your data is secure with us. We use industry-standard encryption for all transactions.' },
            { icon: '💝', title: 'Customer First', desc: 'Everything we do is designed to give you the best possible beauty experience.' },
            { icon: '🚀', title: 'Innovation', desc: 'We constantly improve our platform to make booking faster, easier and smarter.' },
            { icon: '🤝', title: 'Partnership', desc: 'We grow together with salon owners, helping them reach more customers every day.' },
            { icon: '🌿', title: 'Inclusivity', desc: 'Beauty has no boundaries. We welcome salons and customers from all backgrounds.' },
          ].map((value, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '20px',
              padding: '28px', textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #fce7f3',
              transition: 'transform 0.3s'
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', margin: '0 auto 16px'
              }}>{value.icon}</div>
              <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#1f2937', marginBottom: '10px'}}>{value.title}</h3>
              <p style={{color: '#6b7280', fontSize: '14px', lineHeight: '1.6'}}>{value.desc}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <p style={{color: '#db2777', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px', marginBottom: '12px'}}>The People Behind It</p>
          <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#1f2937'}}>Meet Our Team</h2>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px', marginBottom: '80px'}}>
          {[
            { name: 'Okasha Chaudhry', role: 'Founder & CEO', emoji: '👨‍💻', desc: 'Full-stack developer and entrepreneur from Multan, Pakistan.' },
            { name: 'Sarah Ahmed', role: 'Head of Design', emoji: '👩‍🎨', desc: 'Creative director with 5+ years in beauty industry design.' },
            { name: 'Ali Hassan', role: 'Head of Operations', emoji: '👨‍💼', desc: 'Operations expert ensuring smooth salon partnerships.' },
            { name: 'Fatima Khan', role: 'Customer Success', emoji: '👩‍💼', desc: 'Dedicated to making every customer experience perfect.' },
          ].map((member, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '20px',
              padding: '28px', textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #fce7f3'
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #db2777, #9d174d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '36px', margin: '0 auto 16px'
              }}>{member.emoji}</div>
              <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1f2937', marginBottom: '4px'}}>{member.name}</h3>
              <p style={{color: '#db2777', fontWeight: '600', fontSize: '13px', marginBottom: '10px'}}>{member.role}</p>
              <p style={{color: '#6b7280', fontSize: '13px', lineHeight: '1.5'}}>{member.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <p style={{color: '#db2777', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px', marginBottom: '12px'}}>Our Journey</p>
          <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#1f2937'}}>How We Got Here</h2>
        </div>
        <div style={{position: 'relative', marginBottom: '80px'}}>
          {[
            { year: '2024', title: 'The Idea', desc: 'Okasha identified the gap in the market — no easy way to book beauty salons in Pakistan.' },
            { year: '2025', title: 'Development Begins', desc: 'Built the platform from scratch using React, Node.js and MongoDB Atlas.' },
            { year: '2026', title: 'Launch', desc: 'GlamourFind officially launched with its first salon partner in Multan.' },
            { year: 'Future', title: 'Expansion', desc: 'Plans to expand to all major cities in Pakistan and beyond.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '24px', alignItems: 'flex-start',
              marginBottom: '32px', padding: '24px',
              background: 'white', borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #fce7f3'
            }}>
              <div style={{
                minWidth: '80px', height: '80px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #db2777, #9d174d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '700', fontSize: '14px',
                fontFamily: "'Playfair Display', serif", textAlign: 'center'
              }}>{item.year}</div>
              <div>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#1f2937', marginBottom: '8px'}}>{item.title}</h3>
                <p style={{color: '#6b7280', fontSize: '15px', lineHeight: '1.6'}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #db2777, #9d174d)',
          borderRadius: '24px', padding: '60px',
          textAlign: 'center', color: 'white'
        }}>
          <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '40px', marginBottom: '16px'}}>
            Ready to Experience GlamourFind?
          </h2>
          <p style={{fontSize: '18px', opacity: 0.85, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px'}}>
            Join thousands of happy customers booking beauty appointments every day.
          </p>
          <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'white', color: '#db2777',
                border: 'none', padding: '14px 32px',
                borderRadius: '25px', fontWeight: '700',
                fontSize: '15px', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >Get Started Free →</button>
            <button
              onClick={() => navigate('/contact')}
              style={{
                background: 'transparent', color: 'white',
                border: '2px solid rgba(255,255,255,0.5)',
                padding: '14px 32px', borderRadius: '25px',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer'
              }}
            >Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
          <p style={{color: '#fce7f3', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px', marginBottom: '12px'}}>Get In Touch</p>
          <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: '52px', fontWeight: '700', marginBottom: '16px'}}>Contact Us</h1>
          <p style={{fontSize: '18px', opacity: 0.85, maxWidth: '500px', margin: '0 auto'}}>
            Have a question or feedback? We'd love to hear from you!
          </p>
        </div>
      </div>

      <div style={{maxWidth: '1100px', margin: '0 auto', padding: '60px 32px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px'}}>

          {/* Contact Info */}
          <div>
            <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#1f2937', marginBottom: '8px'}}>
              Let's Talk
            </h2>
            <p style={{color: '#6b7280', marginBottom: '32px', lineHeight: '1.6'}}>
              Whether you're a customer looking for help or a salon owner wanting to list your business, we're here for you!
            </p>

            {[
              { icon: '📍', title: 'Our Location', value: 'Multan, Punjab, Pakistan' },
              { icon: '📞', title: 'Phone Number', value: '+92 300 1234567' },
              { icon: '✉️', title: 'Email Address', value: 'hello@glamourfind.com' },
              { icon: '🕐', title: 'Working Hours', value: 'Mon - Sat: 9am - 8pm' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                marginBottom: '24px', padding: '20px',
                background: 'white', borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: '1px solid #fce7f3'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0
                }}>{item.icon}</div>
                <div>
                  <p style={{fontWeight: '700', color: '#1f2937', marginBottom: '4px'}}>{item.title}</p>
                  <p style={{color: '#6b7280', fontSize: '15px'}}>{item.value}</p>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div style={{marginTop: '32px'}}>
              <p style={{fontWeight: '700', color: '#1f2937', marginBottom: '16px'}}>Follow Us</p>
              <div style={{display: 'flex', gap: '12px'}}>
                {[
                  { icon: '📘', label: 'Facebook' },
                  { icon: '📸', label: 'Instagram' },
                  { icon: '🐦', label: 'Twitter' },
                  { icon: '▶️', label: 'YouTube' },
                ].map((social, i) => (
                  <div key={i} style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #db2777, #9d174d)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(219,39,119,0.3)'
                  }}>{social.icon}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: 'white', borderRadius: '24px',
            padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid #fce7f3'
          }}>
            {submitted ? (
              <div style={{textAlign: 'center', padding: '40px 0'}}>
                <span style={{fontSize: '64px'}}>🎉</span>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#1f2937', marginTop: '16px'}}>
                  Message Sent!
                </h3>
                <p style={{color: '#6b7280', marginTop: '8px', marginBottom: '24px'}}>
                  Thank you for reaching out. We'll get back to you within 24 hours!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    background: 'linear-gradient(135deg, #db2777, #9d174d)',
                    color: 'white', border: 'none',
                    padding: '12px 28px', borderRadius: '25px',
                    fontWeight: '700', cursor: 'pointer', fontSize: '15px'
                  }}
                >Send Another Message</button>
              </div>
            ) : (
              <>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#1f2937', marginBottom: '8px'}}>
                  Send a Message
                </h3>
                <p style={{color: '#6b7280', marginBottom: '28px'}}>Fill out the form and we'll respond shortly</p>

                <form onSubmit={handleSubmit}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                    {[
                      { label: 'Your Name', name: 'name', type: 'text', placeholder: 'Okasha Chaudhry' },
                      { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com' },
                    ].map((field, i) => (
                      <div key={i}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px'}}>{field.label}</label>
                        <input
                          type={field.type} name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                          required
                          style={{
                            width: '100%', padding: '12px 16px',
                            border: '2px solid #fce7f3', borderRadius: '12px',
                            fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                            fontFamily: "'Inter', sans-serif"
                          }}
                          onFocus={e => e.target.style.borderColor = '#db2777'}
                          onBlur={e => e.target.style.borderColor = '#fce7f3'}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px'}}>Subject</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      required
                      style={{
                        width: '100%', padding: '12px 16px',
                        border: '2px solid #fce7f3', borderRadius: '12px',
                        fontSize: '15px', outline: 'none', background: 'white',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      <option value="">Select a subject...</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Issue</option>
                      <option value="salon">List My Salon</option>
                      <option value="payment">Payment Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{marginBottom: '24px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px'}}>Message</label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="Write your message here..."
                      rows="5" required
                      style={{
                        width: '100%', padding: '12px 16px',
                        border: '2px solid #fce7f3', borderRadius: '12px',
                        fontSize: '15px', outline: 'none',
                        boxSizing: 'border-box', resize: 'vertical',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onFocus={e => e.target.style.borderColor = '#db2777'}
                      onBlur={e => e.target.style.borderColor = '#fce7f3'}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%', padding: '14px',
                      background: 'linear-gradient(135deg, #db2777, #9d174d)',
                      color: 'white', border: 'none', borderRadius: '12px',
                      fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(219,39,119,0.4)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    Send Message 📨
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{marginTop: '60px'}}>
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <p style={{color: '#db2777', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px'}}>FAQ</p>
            <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#1f2937'}}>Frequently Asked Questions</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
            {[
              { q: 'How do I book an appointment?', a: 'Simply find your salon, click on it, go to Book Appointment tab, select your service, date and time slot.' },
              { q: 'Is GlamourFind free to use?', a: 'Yes! GlamourFind is completely free for customers. Salon owners can list their salon for free as well.' },
              { q: 'How do I list my salon?', a: 'Register as a Salon Owner, then contact us or use the Admin panel to add your salon to our platform.' },
              { q: 'Can I cancel a booking?', a: 'Yes, you can cancel pending bookings from your My Bookings page before the appointment date.' },
              { q: 'How do I leave a review?', a: 'After visiting a salon, go to the salon profile page, click Reviews tab and submit your rating and comment.' },
              { q: 'Is my data safe?', a: 'Absolutely! We use industry-standard encryption and never share your personal data with third parties.' },
            ].map((faq, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '16px',
                padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: '1px solid #fce7f3'
              }}>
                <h4 style={{fontWeight: '700', color: '#1f2937', marginBottom: '10px', fontSize: '16px'}}>
                  ❓ {faq.q}
                </h4>
                <p style={{color: '#6b7280', fontSize: '14px', lineHeight: '1.6'}}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
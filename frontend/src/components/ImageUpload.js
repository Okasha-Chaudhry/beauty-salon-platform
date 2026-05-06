import React, { useState } from 'react';
import { uploadSalonImages, deleteSalonImage, saveSalonImages } from '../services/api';

const ImageUpload = ({ salonId, existingImages = [], onImagesUpdated }) => {
  const [images, setImages] = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (images.length + files.length > 5) {
      setMsg('❌ Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    setMsg('');

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const res = await uploadSalonImages(formData);
      const newImages = [...images, ...res.data];
      setImages(newImages);

      // Save to salon
      await saveSalonImages(salonId, newImages);
      onImagesUpdated(newImages);
      setMsg('✅ Images uploaded successfully!');
    } catch (err) {
      setMsg('❌ Upload failed. Please try again.');
    }
    setUploading(false);
  };

  const handleDelete = async (publicId, index) => {
    try {
      await deleteSalonImage(publicId.replace('glamourfind-salons/', ''));
      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
      await saveSalonImages(salonId, updated);
      onImagesUpdated(updated);
      setMsg('✅ Image deleted!');
    } catch (err) {
      setMsg('❌ Failed to delete image');
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
        📸 Salon Photos ({images.length}/5)
      </label>

      {msg && (
        <div style={{
          background: msg.includes('✅') ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${msg.includes('✅') ? '#86efac' : '#fca5a5'}`,
          color: msg.includes('✅') ? '#16a34a' : '#dc2626',
          padding: '10px 14px', borderRadius: '10px',
          marginBottom: '12px', fontWeight: '600', fontSize: '14px'
        }}>{msg}</div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px', marginBottom: '16px'
        }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
              <img
                src={img.url}
                alt={`Salon ${i + 1}`}
                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
              />
              <button
                onClick={() => handleDelete(img.public_id, i)}
                style={{
                  position: 'absolute', top: '6px', right: '6px',
                  background: 'rgba(220,38,38,0.9)',
                  color: 'white', border: 'none',
                  borderRadius: '50%', width: '28px', height: '28px',
                  cursor: 'pointer', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px'
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < 5 && (
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', padding: '16px',
          border: '2px dashed #db2777', borderRadius: '12px',
          cursor: 'pointer', color: '#db2777',
          fontWeight: '700', fontSize: '14px',
          background: '#fdf2f8',
          transition: 'all 0.3s'
        }}>
          {uploading ? '⏳ Uploading...' : '📸 Click to upload photos'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      )}
      <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '6px' }}>
        Upload up to 5 photos. JPG, PNG or WebP. Max 5MB each.
      </p>
    </div>
  );
};

export default ImageUpload;
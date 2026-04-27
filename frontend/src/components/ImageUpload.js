import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'glamourfind');
    formData.append('cloud_name', 'dz9ksokof');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dz9ksokof/image/upload',
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setPreview(data.secure_url);
      onImageUpload(data.secure_url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  return (
    <div>
      {preview ? (
        <div style={{position: 'relative', marginBottom: '16px'}}>
          <img
            src={preview} alt="Salon"
            style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px'}}
          />
          <button
            onClick={() => { setPreview(null); onImageUpload(''); }}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              background: '#dc2626', color: 'white', border: 'none',
              borderRadius: '50%', width: '28px', height: '28px',
              cursor: 'pointer', fontWeight: '700', fontSize: '14px'
            }}
          >✕</button>
        </div>
      ) : (
        <label style={{
          display: 'block', border: '2px dashed #fce7f3',
          borderRadius: '12px', padding: '32px',
          textAlign: 'center', cursor: 'pointer',
          background: '#fdf2f8', marginBottom: '16px'
        }}>
          <input
            type="file" accept="image/*"
            onChange={handleUpload}
            style={{display: 'none'}}
          />
          {uploading ? (
            <div>
              <p style={{fontSize: '32px'}}>⏳</p>
              <p style={{color: '#db2777', fontWeight: '600', marginTop: '8px'}}>Uploading...</p>
            </div>
          ) : (
            <div>
              <p style={{fontSize: '40px'}}>📸</p>
              <p style={{color: '#db2777', fontWeight: '700', marginTop: '8px'}}>Click to upload image</p>
              <p style={{color: '#9ca3af', fontSize: '13px', marginTop: '4px'}}>PNG, JPG up to 10MB</p>
            </div>
          )}
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
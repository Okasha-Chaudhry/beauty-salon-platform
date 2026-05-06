const express = require('express');
const router = express.Router();
const { cloudinary, upload } = require('../config/cloudinary');
const { protect, salonOwnerOnly } = require('../middleware/auth');
const Salon = require('../models/Salon');

// Upload single image
router.post('/salon-image', protect, salonOwnerOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload multiple images (up to 5)
router.post('/salon-images', protect, salonOwnerOnly, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No images uploaded' });
    const urls = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete image
router.delete('/salon-image/:public_id', protect, salonOwnerOnly, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.public_id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save images to salon
router.put('/salon-images/:salonId', protect, salonOwnerOnly, async (req, res) => {
  try {
    const { images } = req.body;
    const salon = await Salon.findByIdAndUpdate(
      req.params.salonId,
      { images },
      { new: true }
    );
    res.json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
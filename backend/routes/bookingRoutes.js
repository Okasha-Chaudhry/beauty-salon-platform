const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { protect, salonOwnerOnly } = require("../middleware/auth"); // 👈 ADD THIS

// GET all bookings (admin use)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email")
      .populate("salon", "name location");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET bookings for a specific salon (salon owner) 👈 NEW
router.get("/salon/:salonId", protect, salonOwnerOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({ salon: req.params.salonId })
      .populate("customer", "name email")
      .populate("salon", "name location");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update booking status
router.put("/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
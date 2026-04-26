const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Salon = require("../models/Salon");
const { protect, salonOwnerOnly } = require("../middleware/auth");
const {
  sendBookingConfirmationToCustomer,
  sendNewBookingNotificationToOwner,
  sendBookingStatusUpdateToCustomer,
} = require("../utils/emailService");

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

// GET bookings for a specific salon (salon owner)
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

// POST create booking — sends emails to customer + owner
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();

    // Fetch full details for email
    const customer = await User.findById(req.body.customer);
    const salon = await Salon.findById(req.body.salon).populate("owner", "name email");

    const bookingDetails = {
      salonName: salon?.name || "Salon",
      salonLocation: salon?.location || "",
      service: req.body.service,
      date: new Date(req.body.date).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }),
      timeSlot: req.body.timeSlot,
      customerName: customer?.name || "Customer",
      customerEmail: customer?.email || "",
    };

    // Email to customer
    if (customer?.email) {
      sendBookingConfirmationToCustomer(customer.email, customer.name, bookingDetails);
    }

    // Email to salon owner
    if (salon?.owner?.email) {
      sendNewBookingNotificationToOwner(salon.owner.email, salon.owner.name, bookingDetails);
    }

    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update booking status — sends status update email to customer
router.put("/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("customer", "name email")
      .populate("salon", "name location");

    // Send status update email if status changed to confirmed or cancelled
    if (req.body.status === "confirmed" || req.body.status === "cancelled") {
      const bookingDetails = {
        salonName: updated.salon?.name || "Salon",
        service: updated.service,
        date: new Date(updated.date).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }),
        timeSlot: updated.timeSlot,
      };

      if (updated.customer?.email) {
        sendBookingStatusUpdateToCustomer(
          updated.customer.email,
          updated.customer.name,
          bookingDetails,
          req.body.status
        );
      }
    }

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
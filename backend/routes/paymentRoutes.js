const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");

// Create payment intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to paisa (smallest unit)
      currency: "pkr",
      metadata: { bookingId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirm payment — update booking payment status
router.post("/confirm-payment", async (req, res) => {
  try {
    const { bookingId } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: "paid" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
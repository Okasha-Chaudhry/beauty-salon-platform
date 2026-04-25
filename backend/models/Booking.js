const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
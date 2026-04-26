const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  services: [{ type: String }],
  priceRange: { type: String },
  location: { type: String },
  contactInfo: { type: String },
  workingHours: { type: String },
  ratings: [{ type: Number }],
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // 👈 ADD THIS
}, { timestamps: true });

module.exports = mongoose.model("Salon", salonSchema);
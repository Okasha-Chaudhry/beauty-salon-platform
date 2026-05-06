const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, default: '30 mins' }
});

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  services: [serviceSchema],
  priceRange: { type: String },
  location: { type: String },
  address: { type: String },
  coordinates: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  contactInfo: { type: String },
  workingHours: { type: String },
  ratings: [{ type: Number }],
  images: [{
  url: { type: String },
  public_id: { type: String }
   }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Salon", salonSchema);
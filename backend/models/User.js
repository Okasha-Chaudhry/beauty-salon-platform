const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "salon_owner", "admin"], default: "customer" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salon" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
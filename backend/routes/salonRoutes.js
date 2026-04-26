const express = require("express");
const router = express.Router();
const Salon = require("../models/Salon");
const { protect, adminOnly, salonOwnerOnly } = require("../middleware/auth");

// GET all salons (public)
router.get("/", async (req, res) => {
  try {
    const salons = await Salon.find().populate("owner", "name email");
    res.json(salons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my salon (salon owner)
router.get("/my-salon", protect, salonOwnerOnly, async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner: req.user._id });
    if (!salon) return res.status(404).json({ message: "No salon found. Please create one." });
    res.json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single salon (public)
router.get("/:id", async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id).populate("owner", "name email");
    if (!salon) return res.status(404).json({ message: "Salon not found" });
    res.json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create salon (admin or salon owner)
router.post("/", protect, async (req, res) => {
  try {
    const salonData = {
      ...req.body,
      owner: req.user.role === "salon_owner" ? req.user._id : req.body.owner || null
    };
    const salon = new Salon(salonData);
    const savedSalon = await salon.save();
    res.status(201).json(savedSalon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update salon
router.put("/:id", protect, async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ message: "Salon not found" });

    // Admin can update any salon
    // Salon owner can update if: no owner set yet, OR they are the owner
    if (req.user.role !== "admin") {
      if (salon.owner && String(salon.owner) !== String(req.user._id)) {
        return res.status(403).json({ message: "Not authorized to update this salon" });
      }
      // Auto-assign owner if not set
      if (!salon.owner) {
        req.body.owner = req.user._id;
      }
    }

    const updated = await Salon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE salon (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Salon.findByIdAndDelete(req.params.id);
    res.json({ message: "Salon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Salon = require("../models/Salon");

// GET all salons
router.get("/", async (req, res) => {
  try {
    const salons = await Salon.find();
    res.json(salons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single salon
router.get("/:id", async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ message: "Salon not found" });
    res.json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create salon
router.post("/", async (req, res) => {
  try {
    const salon = new Salon(req.body);
    const savedSalon = await salon.save();
    res.status(201).json(savedSalon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update salon
router.put("/:id", async (req, res) => {
  try {
    const updated = await Salon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE salon
router.delete("/:id", async (req, res) => {
  try {
    await Salon.findByIdAndDelete(req.params.id);
    res.json({ message: "Salon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
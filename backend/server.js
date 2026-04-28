const express = require("express");
const mongoose = require("mongoose");

const salonRoutes = require("./routes/salonRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Manual CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Routes
app.use("/api/salons", salonRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Beauty Salon API is running! 💄");
});

// Auto-migrate old string services to new object format
const migrateSalons = async () => {
  try {
    const Salon = require("./models/Salon");
    const salons = await Salon.find({});
    for (const salon of salons) {
      let needsUpdate = false;
      const updatedServices = salon.services.map(service => {
        if (typeof service === 'string') {
          needsUpdate = true;
          return { name: service, price: 0 };
        }
        return service;
      });
      if (needsUpdate) {
        await Salon.findByIdAndUpdate(salon._id, { services: updatedServices });
        console.log(`✅ Migrated services for salon: ${salon.name}`);
      }
    }
    console.log("✅ Salon migration complete!");
  } catch (err) {
    console.error("❌ Migration error:", err.message);
  }
};

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database connected successfully!");
    migrateSalons();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Database connection error:", err);
  });
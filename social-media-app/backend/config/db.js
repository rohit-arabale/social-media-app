// ─────────────────────────────────────────────────────────
// config/db.js — Database Connection
//
// This file connects our app to MongoDB.
// We call connectDB() once at server startup.
// ─────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise — we await it
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the process
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;

// ─────────────────────────────────────────────────────────
// server.js — The Heart of the Backend
//
// Think of this as the "main door" of your app.
// Every request from the browser comes here first.
// ─────────────────────────────────────────────────────────

// Load environment variables from .env file FIRST
// (so process.env.PORT etc. work everywhere)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import all route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

// ── Create Express App ───────────────────────────────────
const app = express();

// ── Connect to MongoDB ───────────────────────────────────
connectDB();

// ── Middleware (runs before every request) ───────────────

// CORS: Allows your React frontend to talk to this backend.
// Without this, the browser blocks the request!
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // React runs here, or production URL
    credentials: true,
  })
);

// Parse incoming JSON data (so req.body works)
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files.
// If someone visits /uploads/photo.jpg, they'll see the image.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ───────────────────────────────────────────────
// All auth routes are prefixed with /api/auth
app.use("/api/auth", authRoutes);

// All user routes are prefixed with /api/users
app.use("/api/users", userRoutes);

// All post routes are prefixed with /api/posts
app.use("/api/posts", postRoutes);

// ── Health Check Route ───────────────────────────────────
// Visit http://localhost:5000/ to confirm server is running
app.get("/", (req, res) => {
  res.json({ message: "✅ Social Media API is running!" });
});

// ── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

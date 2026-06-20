// ─────────────────────────────────────────────────────────
// routes/authRoutes.js — Authentication Endpoints
//
// Routes connect a URL path to a controller function.
// ─────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register → Create new account
router.post("/register", register);

// POST /api/auth/login → Log in, receive token
router.post("/login", login);

// GET /api/auth/me → Get current user (protected — must be logged in)
router.get("/me", protect, getMe);

module.exports = router;

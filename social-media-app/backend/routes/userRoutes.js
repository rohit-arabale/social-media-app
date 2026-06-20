// ─────────────────────────────────────────────────────────
// routes/userRoutes.js — User Profile Endpoints
// ─────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// GET /api/users → Get all users (protected)
router.get("/", protect, getAllUsers);

// GET /api/users/:id → Get a specific user's profile (protected)
router.get("/:id", protect, getUserProfile);

// PUT /api/users/:id → Update profile (protected)
// upload.single("profilePic") handles one file with field name "profilePic"
router.put("/:id", protect, upload.single("profilePic"), updateUserProfile);

module.exports = router;

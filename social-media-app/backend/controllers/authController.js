// ─────────────────────────────────────────────────────────
// controllers/authController.js — Register & Login Logic
//
// Controllers contain the actual business logic.
// They receive the request, do the work, send the response.
// ─────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: Generate JWT Token ────────────────────────────
// A JWT token is like a "visitor pass" — it proves who you are.
// We create one after login and send it to the frontend.
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload: what we store inside the token
    process.env.JWT_SECRET, // Secret key to sign the token
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Expiry
  );
};

// ─────────────────────────────────────────────────────────
// REGISTER — POST /api/auth/register
// Creates a new user account
// ─────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ── Validate input ─────────────────────────────────────
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password",
      });
    }

    // ── Check for existing user ────────────────────────────
    const existingUser = await User.findOne({
      $or: [{ email }, { username }], // Check both email AND username
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // ── Create user ────────────────────────────────────────
    // Password gets hashed automatically by the pre-save hook in User model
    const user = await User.create({ username, email, password });

    // ── Generate token ─────────────────────────────────────
    const token = generateToken(user._id);

    // ── Send response ──────────────────────────────────────
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────
// LOGIN — POST /api/auth/login
// Checks credentials and returns a token
// ─────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validate input ─────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ── Find user (include password for comparison) ────────
    // We use .select("+password") because password has select:false in schema
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ── Check password ─────────────────────────────────────
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ── Generate token ─────────────────────────────────────
    const token = generateToken(user._id);

    // ── Send response ──────────────────────────────────────
    res.json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────
// GET ME — GET /api/auth/me
// Returns the currently logged-in user's data
// ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { register, login, getMe };

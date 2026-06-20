// ─────────────────────────────────────────────────────────
// middleware/authMiddleware.js — Protect Private Routes
//
// Middleware = code that runs BETWEEN the request and the route.
//
// When a user wants to create a post, we must verify
// they are logged in. This middleware checks their JWT token.
// ─────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    // The header looks like: "Authorization: Bearer eyJhbGciOiJ..."
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Split "Bearer eyJhbG..." and grab the token part
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token found, reject the request
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not logged in. Please log in to access this.",
      });
    }

    // Verify the token is valid and not expired
    // jwt.verify throws an error if token is invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID stored in the token
    // We attach the user to req so route handlers can access it
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // Call next() to proceed to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  }
};

module.exports = { protect };

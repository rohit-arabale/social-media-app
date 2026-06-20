// ─────────────────────────────────────────────────────────
// models/User.js — User Database Schema
//
// A "model" is a blueprint for how data is stored in MongoDB.
// Every user in the database will follow this shape.
// ─────────────────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── Define the Schema (shape of a User document) ─────────
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true, // No two users can have the same username
      trim: true, // Remove extra whitespace
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Always store email in lowercase
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // select: false means password won't be returned in queries by default
      select: false,
    },

    profilePic: {
      type: String,
      default: "", // Empty string if no picture uploaded
    },

    bio: {
      type: String,
      default: "",
      maxlength: [200, "Bio cannot exceed 200 characters"],
    },

    // Array of user IDs that this user follows
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Array of user IDs that follow this user
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ── Pre-save Hook: Hash Password Before Saving ────────────
// This runs automatically BEFORE a user is saved to the DB.
// It converts plain text password → hashed password.
// e.g., "mypassword" → "$2a$10$abc123xyz..."
userSchema.pre("save", async function (next) {
  // Only hash if password was changed (avoids re-hashing on profile updates)
  if (!this.isModified("password")) return next();

  // Salt rounds = 12 means it runs the hashing 2^12 = 4096 times (very secure)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance Method: Check Password ──────────────────────
// We can call user.comparePassword("enteredPwd") to check login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model so other files can use it
module.exports = mongoose.model("User", userSchema);

// ─────────────────────────────────────────────────────────
// models/Post.js — Post Database Schema
//
// Every post (with text, image, likes, comments) follows
// this blueprint when stored in MongoDB.
// ─────────────────────────────────────────────────────────

const mongoose = require("mongoose");

// ── Comment Sub-Schema ────────────────────────────────────
// Comments are embedded inside the Post document.
// No need for a separate Comment collection!
const commentSchema = new mongoose.Schema(
  {
    // Which user wrote the comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },

    // The comment text
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true, // Each comment gets createdAt
  }
);

// ── Post Schema ───────────────────────────────────────────
const postSchema = new mongoose.Schema(
  {
    // Who created this post
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The post text/caption
    text: {
      type: String,
      trim: true,
      maxlength: [2000, "Post cannot exceed 2000 characters"],
    },

    // Path to the uploaded image (optional)
    image: {
      type: String,
      default: null,
    },

    // Array of user IDs who liked this post
    // Using a Set-like approach: each user can only like once
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Array of comment objects (using the sub-schema above)
    comments: [commentSchema],
  },
  {
    timestamps: true, // Post gets createdAt and updatedAt
  }
);

module.exports = mongoose.model("Post", postSchema);

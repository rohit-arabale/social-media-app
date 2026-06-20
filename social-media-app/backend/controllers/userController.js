// ─────────────────────────────────────────────────────────
// controllers/userController.js — User Profile Logic
// ─────────────────────────────────────────────────────────

const User = require("../models/User");
const Post = require("../models/Post");

// ─────────────────────────────────────────────────────────
// GET USER PROFILE — GET /api/users/:id
// Returns a user's profile data
// ─────────────────────────────────────────────────────────
const getUserProfile = async (req, res) => {
  try {
    // req.params.id is the :id part from the URL
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Also get the user's posts
    const posts = await Post.find({ userId: req.params.id })
      .populate("userId", "username profilePic") // Fill in user data
      .populate("comments.userId", "username profilePic")
      .sort({ createdAt: -1 }); // Newest first

    res.json({ success: true, user, posts });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────
// UPDATE USER PROFILE — PUT /api/users/:id
// Update bio, profilePic, username
// ─────────────────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
  try {
    // Make sure the logged-in user can only update THEIR OWN profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    const { username, bio } = req.body;

    // Build the update object
    const updateData = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;

    // If a new profile picture was uploaded, save its path
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    // findByIdAndUpdate: find user, update, return new version
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // new:true returns updated doc
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────
// GET ALL USERS — GET /api/users
// Returns list of all users (for People to Follow feature)
// ─────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    // Exclude the current logged-in user from results
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("username profilePic bio followers")
      .limit(20);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers };

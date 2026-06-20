// ─────────────────────────────────────────────────────────
// routes/postRoutes.js — Post Endpoints
// ─────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const {
  createPost,
  getFeed,
  likePost,
  addComment,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// All post routes require authentication (protect middleware)

// POST /api/posts/create → Create new post (with optional image)
// upload.single("image") handles one image with field name "image"
router.post("/create", protect, upload.single("image"), createPost);

// GET /api/posts/feed → Get all posts (home feed)
router.get("/feed", protect, getFeed);

// PUT /api/posts/like/:id → Like or unlike a post
router.put("/like/:id", protect, likePost);

// POST /api/posts/comment/:id → Add a comment
router.post("/comment/:id", protect, addComment);

// DELETE /api/posts/:id → Delete a post
router.delete("/:id", protect, deletePost);

module.exports = router;

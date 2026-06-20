// ─────────────────────────────────────────────────────────
// controllers/postController.js — Post CRUD Logic
// ─────────────────────────────────────────────────────────

const Post = require("../models/Post");

// ─────────────────────────────────────────────────────────
// CREATE POST — POST /api/posts/create
// Creates a new post (with optional image)
// ─────────────────────────────────────────────────────────
const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    // A post must have at least text OR an image
    if (!text && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Post must have text or an image",
      });
    }

    // Build the post data
    const postData = {
      userId: req.user._id, // The logged-in user's ID
      text: text || "",
    };

    // If an image was uploaded, save its URL path
    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    // Save to database
    let post = await Post.create(postData);

    // Populate means: fill in the user details (username, pic)
    // instead of just storing the user ID
    post = await Post.findById(post._id)
      .populate("userId", "username profilePic")
      .populate("comments.userId", "username profilePic");

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────
// GET FEED — GET /api/posts/feed
// Returns all posts, newest first (the home feed)
// ─────────────────────────────────────────────────────────
const getFeed = async (req, res) => {
  try {
    // Get page number from query string, default to page 1
    // e.g., /api/posts/feed?page=2
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Posts per page
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("userId", "username profilePic") // Get poster's info
      .populate("comments.userId", "username profilePic") // Get commenter info
      .sort({ createdAt: -1 }) // -1 = descending = newest first
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.json({
      success: true,
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.error("Get feed error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────
// LIKE / UNLIKE POST — PUT /api/posts/like/:id
// Toggle like on a post (like if not liked, unlike if liked)
// ─────────────────────────────────────────────────────────
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const userId = req.user._id;

    // Check if this user already liked the post
    // .toString() is needed because MongoDB IDs are objects, not strings
    const alreadyLiked = post.likes.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Unlike: remove this user's ID from the likes array
      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      // Like: add this user's ID to the likes array
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────
// ADD COMMENT — POST /api/posts/comment/:id
// Adds a comment to a post
// ─────────────────────────────────────────────────────────
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Create the comment object
    const newComment = {
      userId: req.user._id,
      text: text.trim(),
    };

    // Push the comment into the post's comments array
    post.comments.push(newComment);
    await post.save();

    // Re-fetch with populated user data for the response
    const updatedPost = await Post.findById(post._id)
      .populate("userId", "username profilePic")
      .populate("comments.userId", "username profilePic");

    res.status(201).json({
      success: true,
      comments: updatedPost.comments,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────
// DELETE POST — DELETE /api/posts/:id
// Only the post's author can delete it
// ─────────────────────────────────────────────────────────
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createPost, getFeed, likePost, addComment, deletePost };

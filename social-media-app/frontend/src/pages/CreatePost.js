// ─────────────────────────────────────────────────────────
// src/pages/CreatePost.js — Create Post Page
//
// Users can type text and/or upload an image to create a post.
// ─────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./CreatePost.css";

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // The actual File object
  const [imagePreview, setImagePreview] = useState(null); // URL for preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Handle Image Selection ────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check file type
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only image files (JPG, PNG, GIF, WEBP) are allowed");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setImage(file);
    setError("");

    // Create a preview URL for the image
    // URL.createObjectURL creates a temporary URL to display the image
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // ── Remove Selected Image ─────────────────────────────────
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // ── Submit Post ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !image) {
      setError("Please write something or add an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // When uploading files, we use FormData instead of JSON
      // FormData can hold both text and file data
      const formData = new FormData();
      formData.append("text", text);
      if (image) {
        formData.append("image", image); // "image" must match multer's field name
      }

      // We need different headers for file upload
      await API.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success! Go back to feed
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  return (
    <div className="create-page">
      <div className="create-container">
        <div className="create-card card">
          <h1 className="create-title">Create Post</h1>

          {/* Author info */}
          <div className="create-author">
            {user?.profilePic ? (
              <img
                src={`${BASE_URL}${user.profilePic}`}
                alt={user.username}
                className="avatar"
              />
            ) : (
              <div className="avatar-placeholder">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="create-author-name">{user?.username}</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="create-form">
            {/* Text Area */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={2000}
              rows={5}
              className="create-textarea"
            />

            {/* Character count */}
            <div className="char-count">{text.length} / 2000</div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview-wrap">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="remove-image-btn"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Image Upload Button */}
            <div className="create-actions">
              <label htmlFor="imageUpload" className="btn btn-ghost upload-label">
                📷 Add Photo
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }} // Hidden — label triggers it
              />

              <div className="action-right">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || (!text.trim() && !image)}
                >
                  {loading ? "Posting..." : "Publish Post"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

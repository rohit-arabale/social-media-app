// ─────────────────────────────────────────────────────────
// src/components/CommentBox.js — Comments Section
//
// Shows existing comments and allows adding new ones.
// ─────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import "./CommentBox.css";

const timeAgo = (dateString) => {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  return `${diffDay}d`;
};

const CommentBox = ({ postId, comments, onCommentAdded }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  // ── Submit Comment ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;
    if (!user) {
      setError("Please log in to comment");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await API.post(`/posts/comment/${postId}`, { text });

      // Update parent with new comments array
      onCommentAdded(response.data.comments);
      setText(""); // Clear the input
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-box">
      {/* ── Comment List ─────────────────────────────── */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment, index) => (
            <div key={comment._id || index} className="comment-item">
              {/* Comment author avatar */}
              <Link to={`/profile/${comment.userId?._id}`}>
                {comment.userId?.profilePic ? (
                  <img
                    src={`${BASE_URL}${comment.userId.profilePic}`}
                    alt={comment.userId.username}
                    className="comment-avatar"
                  />
                ) : (
                  <div className="avatar-placeholder comment-avatar">
                    {comment.userId?.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </Link>

              <div className="comment-content">
                <div className="comment-bubble">
                  <Link
                    to={`/profile/${comment.userId?._id}`}
                    className="comment-username"
                  >
                    {comment.userId?.username || "User"}
                  </Link>
                  <p className="comment-text">{comment.text}</p>
                </div>
                <span className="comment-time">{timeAgo(comment.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add Comment Form ─────────────────────────── */}
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-input-row">
            {/* Current user's avatar */}
            {user.profilePic ? (
              <img
                src={`${BASE_URL}${user.profilePic}`}
                alt={user.username}
                className="comment-avatar"
              />
            ) : (
              <div className="avatar-placeholder comment-avatar">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}

            <div className="comment-input-wrap">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                disabled={submitting}
                className="comment-input"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="comment-submit-btn"
              >
                {submitting ? "..." : "→"}
              </button>
            </div>
          </div>

          {error && <p className="comment-error">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CommentBox;

// ─────────────────────────────────────────────────────────
// src/components/PostCard.js — Single Post Display
//
// Shows: author info, post text, image, like button,
//        comment count, and the comment section.
// ─────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import CommentBox from "./CommentBox";
import "./PostCard.css";

// Helper: format date to "2 hours ago" style
const timeAgo = (dateString) => {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();

  // ── Local state ───────────────────────────────────────────
  // Track likes without re-fetching from server
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Check if the current user has liked this post
  const isLiked = user && likes.some((id) => id === user._id || id._id === user._id);

  // ── Like / Unlike ─────────────────────────────────────────
  const handleLike = async () => {
    if (!user) return;

    try {
      const response = await API.put(`/posts/like/${post._id}`);

      // Update the local likes array based on the response
      if (response.data.liked) {
        setLikes([...likes, user._id]); // Add like
      } else {
        setLikes(likes.filter((id) => {
          const idStr = id._id || id;
          return idStr.toString() !== user._id.toString();
        })); // Remove like
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // ── Delete Post ───────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;

    setDeleting(true);
    try {
      await API.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id); // Tell parent to remove it
    } catch (error) {
      console.error("Delete error:", error);
      setDeleting(false);
    }
  };

  // ── Post Author ───────────────────────────────────────────
  const author = post.userId;
  const isOwner = user && author && (author._id === user._id || author._id?.toString() === user._id?.toString());

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  return (
    <article className="post-card card fade-in">
      {/* ── Header: Author Info ─────────────────────────── */}
      <div className="post-header">
        <Link to={`/profile/${author?._id}`} className="post-author-link">
          {author?.profilePic ? (
            <img
              src={`${BASE_URL}${author.profilePic}`}
              alt={author.username}
              className="post-avatar"
            />
          ) : (
            <div className="avatar-placeholder post-avatar">
              {author?.username?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <span className="post-username">{author?.username || "Unknown"}</span>
            <span className="post-time">{timeAgo(post.createdAt)}</span>
          </div>
        </Link>

        {/* Delete button (only for post owner) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="post-delete-btn"
            title="Delete post"
          >
            {deleting ? "..." : "🗑"}
          </button>
        )}
      </div>

      {/* ── Post Text ──────────────────────────────────────── */}
      {post.text && <p className="post-text">{post.text}</p>}

      {/* ── Post Image ─────────────────────────────────────── */}
      {post.image && (
        <div className="post-image-wrap">
          <img
            src={`${BASE_URL}${post.image}`}
            alt="Post"
            className="post-image"
            loading="lazy"
          />
        </div>
      )}

      {/* ── Actions: Like + Comment Count ──────────────────── */}
      <div className="post-actions">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`action-btn like-btn ${isLiked ? "liked" : ""}`}
        >
          <span className="action-icon">{isLiked ? "❤️" : "🤍"}</span>
          <span>{likes.length} {likes.length === 1 ? "like" : "likes"}</span>
        </button>

        {/* Comment Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="action-btn comment-btn"
        >
          <span className="action-icon">💬</span>
          <span>{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
        </button>
      </div>

      {/* ── Comments Section ─────────────────────────────────── */}
      {showComments && (
        <CommentBox
          postId={post._id}
          comments={comments}
          onCommentAdded={(newComments) => setComments(newComments)}
        />
      )}
    </article>
  );
};

export default PostCard;

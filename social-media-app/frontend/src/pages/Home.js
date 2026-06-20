// ─────────────────────────────────────────────────────────
// src/pages/Home.js — Home Feed Page
//
// Shows all posts from all users, newest first.
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // ── Fetch Posts ─────────────────────────────────────────
  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await API.get(`/posts/feed?page=${pageNum}`);
      const { posts: newPosts, totalPages: tp } = response.data;

      if (append) {
        // Load More: add to existing posts
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        // Fresh load
        setPosts(newPosts);
      }

      setTotalPages(tp);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load posts on mount
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // ── Handle Post Deletion ──────────────────────────────────
  const handleDelete = (deletedPostId) => {
    // Remove the deleted post from local state
    setPosts((prev) => prev.filter((p) => p._id !== deletedPostId));
  };

  // ── Load More ─────────────────────────────────────────────
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  // ── Render ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="home-layout">
        <div className="feed-column">
          <div className="loading-center"><div className="spinner"></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      {/* ── Feed Column ─────────────────────────────────── */}
      <main className="feed-column">
        {/* Quick Create Post prompt */}
        <div className="quick-create card">
          <div className="quick-create-inner">
            {user?.profilePic ? (
              <img
                src={`${process.env.REACT_APP_BASE_URL}${user.profilePic}`}
                alt={user.username}
                className="avatar"
              />
            ) : (
              <div className="avatar-placeholder">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <Link to="/create" className="quick-create-input">
              What's on your mind, {user?.username}?
            </Link>
          </div>
          <Link to="/create" className="btn btn-primary">
            Post
          </Link>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="empty-feed card">
            <div className="empty-icon">🌱</div>
            <h3>Feed is empty</h3>
            <p>Be the first to post something!</p>
            <Link to="/create" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Create First Post
            </Link>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} />
            ))}

            {/* Load More Button */}
            {page < totalPages && (
              <div className="load-more">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="btn btn-ghost"
                >
                  {loadingMore ? "Loading..." : "Load more posts"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Sidebar Column ──────────────────────────────── */}
      <aside className="sidebar-column">
        <div className="card sidebar-card">
          <h3 className="sidebar-title">About Socially</h3>
          <p className="sidebar-text">
            Share moments, connect with others, and discover what the community is talking about.
          </p>
          <p className="sidebar-credit">Developed by Rohit Arabale</p>
          <Link to="/create" className="btn btn-primary btn-full" style={{ marginTop: "1rem" }}>
            ✏️ Create Post
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default Home;

// ─────────────────────────────────────────────────────────
// src/components/Navbar.js — Top Navigation Bar
//
// Shows the app name, nav links, and user info.
// ─────────────────────────────────────────────────────────

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Know which page we're on

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper: check if a link is the current page
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* ── Logo ─────────────────────────────────── */}
        <Link to="/" className="navbar-logo">
          Socially
        </Link>

        {/* ── Center Links ─────────────────────────── */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            🏠 Feed
          </Link>
          <Link
            to="/create"
            className={`nav-link ${isActive("/create") ? "active" : ""}`}
          >
            ✏️ Post
          </Link>
        </div>

        {/* ── Right Side: User Info ─────────────────── */}
        {user && (
          <div className="navbar-user">
            <Link to={`/profile/${user._id}`} className="navbar-profile-link">
              {/* Show profile picture or initials */}
              {user.profilePic ? (
                <img
                  src={`${process.env.REACT_APP_BASE_URL}${user.profilePic}`}
                  alt={user.username}
                  className="navbar-avatar"
                />
              ) : (
                <div className="navbar-avatar-placeholder">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="navbar-username">{user.username}</span>
            </Link>

            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

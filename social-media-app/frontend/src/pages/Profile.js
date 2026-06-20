// ─────────────────────────────────────────────────────────
// src/pages/Profile.js — User Profile Page
//
// Shows user info, bio, profile picture, and their posts.
// Allows editing if it's YOUR profile.
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams(); // Get user ID from URL: /profile/:id
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", bio: "" });
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const isOwnProfile = currentUser?._id === id;
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  // ── Fetch Profile Data ────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/users/${id}`);
        setProfileUser(response.data.user);
        setPosts(response.data.posts);
        setEditForm({
          username: response.data.user.username,
          bio: response.data.user.bio || "",
        });
      } catch (err) {
        if (err.response?.status === 404) {
          setError("User not found");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // ── Handle Avatar Change ──────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Save Profile Changes ──────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      const formData = new FormData();
      formData.append("username", editForm.username);
      formData.append("bio", editForm.bio);
      if (newAvatar) {
        formData.append("profilePic", newAvatar);
      }

      const response = await API.put(`/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data.user;
      setProfileUser(updatedUser);

      // Update global auth context so navbar shows new info
      updateUser(updatedUser);

      setEditing(false);
      setNewAvatar(null);
      setAvatarPreview(null);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // ── Handle Post Deletion ──────────────────────────────────
  const handleDelete = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  // ── Loading / Error States ────────────────────────────────
  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>{error}</h2>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* ── Profile Header Card ─────────────────────────────── */}
      <div className="profile-header card">
        {/* Avatar */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrap">
            {(avatarPreview || profileUser?.profilePic) ? (
              <img
                src={avatarPreview || `${BASE_URL}${profileUser.profilePic}`}
                alt={profileUser.username}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {profileUser?.username?.[0]?.toUpperCase()}
              </div>
            )}

            {/* Avatar change button (edit mode only) */}
            {editing && (
              <label htmlFor="avatarUpload" className="avatar-change-btn">
                📷
                <input
                  type="file"
                  id="avatarUpload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Profile Info / Edit Form */}
        {editing ? (
          /* ── EDIT MODE ─── */
          <form onSubmit={handleSave} className="edit-form">
            {saveError && <div className="alert alert-error">{saveError}</div>}

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                maxLength={200}
                rows={3}
              />
              <small className="char-count">{editForm.bio.length} / 200</small>
            </div>

            <div className="edit-actions">
              <button
                type="button"
                onClick={() => { setEditing(false); setAvatarPreview(null); }}
                className="btn btn-ghost"
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          /* ── VIEW MODE ─── */
          <div className="profile-info">
            <h1 className="profile-username">{profileUser?.username}</h1>

            {profileUser?.bio && (
              <p className="profile-bio">{profileUser.bio}</p>
            )}

            <p className="profile-joined">
              Joined{" "}
              {new Date(profileUser?.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-num">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
            </div>

            {/* Edit button for own profile */}
            {isOwnProfile && (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-outline"
                style={{ marginTop: "1rem" }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Posts Section ────────────────────────────────────── */}
      <div className="profile-posts">
        <h2 className="posts-heading">
          {isOwnProfile ? "Your Posts" : `${profileUser?.username}'s Posts`}
        </h2>

        {posts.length === 0 ? (
          <div className="empty-posts card">
            <p>No posts yet.</p>
            {isOwnProfile && (
              <button
                onClick={() => navigate("/create")}
                className="btn btn-primary"
                style={{ marginTop: "0.75rem" }}
              >
                Create your first post
              </button>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;

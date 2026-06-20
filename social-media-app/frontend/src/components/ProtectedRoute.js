// ─────────────────────────────────────────────────────────
// src/components/ProtectedRoute.js — Auth Guard
//
// Wraps pages that only logged-in users should see.
// If NOT logged in → redirect to /login.
// If logged in → show the page.
// ─────────────────────────────────────────────────────────

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading spinner while we check auth state
  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in — show the page
  return children;
};

export default ProtectedRoute;

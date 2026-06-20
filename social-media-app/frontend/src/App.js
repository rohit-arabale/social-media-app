// ─────────────────────────────────────────────────────────
// src/App.js — Root Application Component
//
// This is where we set up:
// 1. The AuthProvider (global login state)
// 2. React Router (URL-based navigation)
// 3. All page routes
// ─────────────────────────────────────────────────────────

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

// Styles
import "./styles/global.css";

// ── Inner App (needs access to AuthContext) ───────────────
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Show Navbar only when logged in */}
      {user && <Navbar />}

      <Routes>
        {/* Public Routes (no login required) */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protected Routes (must be logged in) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// ── Root App Component ────────────────────────────────────
const App = () => {
  return (
    // BrowserRouter enables URL navigation
    <BrowserRouter>
      {/* AuthProvider makes login state available everywhere */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

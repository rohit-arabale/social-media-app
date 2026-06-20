// ─────────────────────────────────────────────────────────
// src/context/AuthContext.js — Global Auth State
//
// Context API lets us share data (like "who is logged in")
// across ALL components without passing props manually.
//
// Think of it like a global variable that any component
// can read or update.
// ─────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

// Step 1: Create the context object
const AuthContext = createContext(null);

// Step 2: Create the Provider component
// This wraps our entire app and provides the auth state
export const AuthProvider = ({ children }) => {
  // State: the currently logged-in user (or null if not logged in)
  const [user, setUser] = useState(null);

  // State: is the app still loading the initial user data?
  const [loading, setLoading] = useState(true);

  // ── On App Start: Load User from localStorage ─────────────
  // When the page refreshes, we want to stay logged in.
  // We stored the user in localStorage, so we read it back here.
  useEffect(() => {
    const stored = localStorage.getItem("socialUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  // ── LOGIN ─────────────────────────────────────────────────
  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    const { user: userData, token } = response.data;

    // Store user + token together in localStorage
    const userToStore = { ...userData, token };
    localStorage.setItem("socialUser", JSON.stringify(userToStore));
    setUser(userToStore);

    return response.data;
  };

  // ── REGISTER ──────────────────────────────────────────────
  const register = async (username, email, password) => {
    const response = await API.post("/auth/register", {
      username,
      email,
      password,
    });
    const { user: userData, token } = response.data;

    const userToStore = { ...userData, token };
    localStorage.setItem("socialUser", JSON.stringify(userToStore));
    setUser(userToStore);

    return response.data;
  };

  // ── LOGOUT ────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("socialUser");
    setUser(null);
  };

  // ── UPDATE USER (after profile edit) ─────────────────────
  const updateUser = (updatedData) => {
    const current = JSON.parse(localStorage.getItem("socialUser"));
    const merged = { ...current, ...updatedData };
    localStorage.setItem("socialUser", JSON.stringify(merged));
    setUser(merged);
  };

  // The value object is what all child components can access
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isLoggedIn: !!user, // true if user exists
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Step 3: Custom hook for easy access in any component
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

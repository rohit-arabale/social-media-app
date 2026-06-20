// ─────────────────────────────────────────────────────────
// src/api/axios.js — Configured Axios Instance
//
// Axios is a library that makes HTTP requests easy.
// Here we set up a "base" axios that:
// 1. Always points to our backend URL
// 2. Automatically attaches the JWT token to requests
// ─────────────────────────────────────────────────────────

import axios from "axios";

// Create a custom axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ───────────────────────────────────
// This runs BEFORE every request is sent.
// It reads the token from localStorage and adds it to the header.
API.interceptors.request.use(
  (config) => {
    // Get the stored user data from localStorage
    const userData = localStorage.getItem("socialUser");

    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        // Add: "Authorization: Bearer eyJhbGciOiJ..."
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────
// This runs AFTER every response is received.
// If we get a 401 (unauthorized), log the user out automatically.
API.interceptors.response.use(
  (response) => response, // If success, just return the response
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem("socialUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;

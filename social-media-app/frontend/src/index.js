// ─────────────────────────────────────────────────────────
// src/index.js — React Entry Point
//
// This is the very first JS file React runs.
// It attaches the React app to the <div id="root"> in index.html.
// ─────────────────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Find the <div id="root"> in public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render our App inside it
root.render(
  // StrictMode helps catch bugs during development (no effect in production)
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

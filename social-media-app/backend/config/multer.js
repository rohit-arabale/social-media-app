// ─────────────────────────────────────────────────────────
// config/multer.js — Image Upload Configuration
//
// Multer is a library that handles file uploads.
// It saves uploaded files to the /uploads folder.
// ─────────────────────────────────────────────────────────

const multer = require("multer");
const path = require("path");

// ── Storage Settings ─────────────────────────────────────
// diskStorage tells Multer WHERE and HOW to save files
const storage = multer.diskStorage({
  // destination: which folder to save files in
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // null = no error, "uploads/" = folder
  },

  // filename: what to name the saved file
  filename: (req, file, cb) => {
    // Create a unique name: timestamp + original extension
    // e.g., "1700000000000.jpg"
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ── File Filter ──────────────────────────────────────────
// Only allow image files (jpg, jpeg, png, gif, webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  // Check both the file extension AND mime type
  const isValid =
    allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
    allowedTypes.test(file.mimetype);

  if (isValid) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject
  }
};

// ── Create Multer Instance ───────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
});

module.exports = upload;

// routes/auth.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateProfile,
  changePassword,
} from '../controllers/authC.js';

import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';   // ← make sure this exports multer().single('avatar') or similar

const router = express.Router();

// ────────────────────────────────────────────────
// Public routes
// ────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login',    loginUser);

// ────────────────────────────────────────────────
// Protected routes (require valid JWT)
// ────────────────────────────────────────────────

// Update own profile (name, phone, address, avatar)
router.put(
  '/profile',
  protect,                    // must be logged in
  upload.single('avatar'),    // ← multer middleware – processes file field named "avatar"
  updateProfile               // controller runs after file is uploaded
);

// Change own password
router.put('/change-password', protect, changePassword);

// ────────────────────────────────────────────────
// Admin-only routes
// ────────────────────────────────────────────────
router.get('/users', protect, admin, getAllUsers);  // ← added admin middleware

export default router;
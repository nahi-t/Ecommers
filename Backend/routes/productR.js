// routes/productRoutes.js
import express from 'express';
import {
  getProducts,
  getProduct,          // ← the unified function we created
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productC.js';  // ← update filename if needed

import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// ────────────────────────────────────────────────
// Public routes
// ────────────────────────────────────────────────
router.get('/', getProducts);

// Unified route: supports BOTH MongoDB _id and slug
// Example:
//   GET /api/products/64f8a123...       → finds by _id
//   GET /api/products/iphone-15-pro     → finds by slug
router.get('/:identifier', getProduct);

// ────────────────────────────────────────────────
// Protected/Admin routes
// ────────────────────────────────────────────────
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),     // multer for single image upload
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  upload.single('image'),     // optional new image
  updateProduct
);

router.delete('/:id', protect, admin, deleteProduct);

export default router;
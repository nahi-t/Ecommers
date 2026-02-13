import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productC.js';

import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:identifier', getProduct); // by _id or slug

// Admin routes
router.post(
  '/',
  protect,
  admin,
  upload.single('image'), // single image upload
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  upload.single('image'), // optional new image
  updateProduct
);

router.delete('/:id', protect, admin, deleteProduct);

export default router;

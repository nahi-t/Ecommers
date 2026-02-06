// routes/productRoutes.js
import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productC.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';          // ← import here

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct);   // ← middleware here

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)     // ← middleware here
  .delete(protect, admin, deleteProduct);

export default router;
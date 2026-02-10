import express from 'express';
const router = express.Router();

import { protect, admin } from '../middleware/auth.js';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/catagoryC.js';

// Public
router.get('/', getCategories);

// Admin only
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
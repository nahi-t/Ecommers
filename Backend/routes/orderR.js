// routes/orderRoutes.js
import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import { createOrder, getUserOrders } from '../controllers/orderC.js';

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);

export default router;
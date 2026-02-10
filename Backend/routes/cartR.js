import {addToCart,getCart,updateCartItem,removeCartItem} from '../controllers/addTOcart.js';

import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove", protect, removeCartItem);


router.get("/get", protect, getCart);

export default router;

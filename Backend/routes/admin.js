// Example: routes/admin.js
import express from 'express';
import User from '../models/User.js';
import { getAllUsers } from '../controllers/adminC.js';

import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', protect, admin, getAllUsers);

export default router;
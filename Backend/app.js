import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/productR.js';
import cartRoutes from './routes/cartR.js';
import orderRoutes from './routes/orderR.js';
import categoryRoutes from './routes/catagoryR.js';
import { createDefaultAdmin } from './creat-admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "https://ecommers-weld.vercel.app",

  credentials: true // optional, only if you use cookies/auth
}));// allow frontend calls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Frontend serving not needed for Netlify deployment
/*
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'ecommerce-client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'ecommerce-client', 'build', 'index.html'));
  });
}
*/

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    return createDefaultAdmin();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

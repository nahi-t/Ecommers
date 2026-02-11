import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/productR.js';
import cartRoutes from './routes/cartR.js';
import orderRoutes from './routes/orderR.js';
import categoryRoutes from './routes/catagoryR.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({ origin: '*' })); // In production → restrict to your actual frontend URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes (these must come BEFORE the catch-all)
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Serve frontend in production (React build)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build folder
  app.use(express.static(path.join(__dirname, 'ecommerce-client', 'build')));

  // Catch-all route for React SPA - serve index.html for all non-API routes
  app.get('/*path', (req, res) => {
    res.sendFile(path.join(__dirname, 'ecommerce-client', 'build', 'index.html'));
  });
}

// Health check endpoint (useful for Render / monitoring)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start server (Render uses process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
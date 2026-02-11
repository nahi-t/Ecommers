import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/productR.js';
import categoryRoutes from './routes/catagoryR.js';
import cartRoutes from './routes/cartR.js';

// Load environment variables
dotenv.config();

const app = express();

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

// Serve React frontend (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../ecommerce-client/build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../ecommerce-client/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('API is running'));
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

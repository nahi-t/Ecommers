// middleware/multer.js
import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary'; // or import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// NO config here anymore — it's done in server.js

// Local storage for development
// const localStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/';
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// Cloudinary storage for production
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2, // Use the globally configured instance
  params: {
    folder: 'ecommers_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// File filter (unchanged)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG/PNG images allowed'), false);
  }
};

// Use Cloudinary in production, local otherwise
// const storage = process.env.NODE_ENV === 'production' ? cloudStorage : localStorage;
const storage = cloudStorage; // Always use Cloudinary; local is just for testing
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});
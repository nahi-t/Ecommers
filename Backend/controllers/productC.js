// controllers/productController.js
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/catagory.js'; // corrected filename (catagory → Category)
import slugify from 'slugify';

// ────────────────────────────────────────────────
// @desc    Get all products (with optional category filter)
// @route   GET /api/products
// @access  Public
// ────────────────────────────────────────────────
export const getProducts = asyncHandler(async (req, res) => {
  const { category, sort = '-createdAt', limit = 0 } = req.query;

  let filter = {};

  if (category) {
    // Try as ObjectId first
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      // Try as slug
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        filter.category = foundCategory._id;
      }
      // If neither → no filter (or you can return 404 / empty)
    }
  }

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .limit(Number(limit) || 0);

  res.status(200).json(products);
});

// ────────────────────────────────────────────────
// @desc    Get single product by ID or slug
// @route   GET /api/products/:identifier
// @access  Public
// ────────────────────────────────────────────────
export const getProduct = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  let product;

  // 1. Try as ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    product = await Product.findById(identifier).populate('category', 'name slug');
  }

  // 2. If not found → try as slug
  if (!product) {
    product = await Product.findOne({ slug: identifier }).populate('category', 'name slug');
  }

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Optional: increment view count (uncomment if needed)
  // product.views = (product.views || 0) + 1;
  // await product.save();

  res.status(200).json(product);
});

// ────────────────────────────────────────────────
// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
// ────────────────────────────────────────────────
export const createProduct = asyncHandler(async (req, res) => {
  const { title, name, description, price, size, category } = req.body;
  const image = req.file?.path;

  // Validation
  if (!title || !name || !description || !price || !category || !image) {
    res.status(400);
    throw new Error('All fields are required (title, name, description, price, category, image)');
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }

  // Handle sizes (string or array)
  const sizesArray = Array.isArray(size)
    ? size
    : typeof size === 'string'
      ? size.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const product = await Product.create({
    title,
    name,
    description,
    price: Number(price),
    size: sizesArray,
    image,
    category,
    slug: slugify(name, { lower: true, strict: true }),
    createdBy: req.user._id,
  });

  res.status(201).json(product);
});

// ────────────────────────────────────────────────
// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
// ────────────────────────────────────────────────
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { title, name, description, price, size, category } = req.body;

  if (title) product.title = title;
  if (name) {
    product.name = name;
    product.slug = slugify(name, { lower: true, strict: true });
  }
  if (description) product.description = description;
  if (price) product.price = Number(price);

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400);
      throw new Error('Invalid category ID');
    }
    product.category = category;
  }

  if (size !== undefined) {
    product.size = Array.isArray(size)
      ? size
      : typeof size === 'string'
        ? size.split(',').map(s => s.trim()).filter(Boolean)
        : [];
  }

  if (req.file) {
    product.image = req.file.path;
  }

  const updatedProduct = await product.save();

  res.status(200).json(updatedProduct);
});

// ────────────────────────────────────────────────
// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
// ────────────────────────────────────────────────
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
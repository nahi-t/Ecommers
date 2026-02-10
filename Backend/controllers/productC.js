import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/catagory.js'; // Ensure this model exists!
import mongoose from 'mongoose';

// @desc    Get all products (Filtered by ID or Slug)
// @route   GET /api/products?category=slug
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  let filter = {};

  // Only filter if category is provided and is not the string "undefined"
  if (category && category !== 'undefined') {
    if (mongoose.Types.ObjectId.isValid(category)) {
      // If it's a valid Mongo ID, use it directly
      filter.category = category;
    } else {
      // If it's a slug, find the category ID in the Category collection
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        filter.category = foundCategory._id;
      } else {
        // If slug doesn't exist, return empty array immediately
        return res.json([]);
      }
    }
  }

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validation: Prevent CastError if ID is "undefined" or malformed
  if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid or missing Product ID');
  }

  const product = await Product.findById(id).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { title, name, description, price, size, category } = req.body;
  const image = req.file?.path;

  // Basic validation
  if (!title || !name || !description || !price || !category || !image) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }

  const sizesArray = Array.isArray(size) ? size : size.split(',').map(s => s.trim()).filter(Boolean);

  const product = await Product.create({
    title,
    name,
    description,
    price: Number(price),
    size: sizesArray,
    image,
    category,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { title, name, description, price, size, category } = req.body;
  const image = req.file?.path || product.image;

  if (title) product.title = title;
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = Number(price);
  
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400);
      throw new Error('Invalid category ID');
    }
    product.category = category;
  }

  if (size) {
    product.size = Array.isArray(size) ? size : size.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  if (req.file) product.image = image;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});
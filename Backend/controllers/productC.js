// controllers/productController.js
import asyncHandler from 'express-async-handler'; // Recommended: npm install express-async-handler
import Product from '../models/Product.js';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = [
 

  asyncHandler(async (req, res) => {
    const { title, name, description, price, size } = req.body;

    // Validation
    if (!title || !name || !description || !price || !req.file) {
      res.status(400);
      throw new Error('All fields including image are required');
    }

    const sizes = size
      ? size.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (sizes.length === 0) {
      res.status(400);
      throw new Error('At least one size is required');
    }

    const product = new Product({
      title,
      name,
      description,
      price: Number(price),
      size: sizes,
      image: `/uploads/${req.file.filename}`,
      createdBy: req.user._id, // from protect middleware
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  }),
];

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = [

  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const { title, name, description, price, size } = req.body;

    product.title = title || product.title;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;

    if (size) {
      product.size = size.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  }),
];

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
  res.json({ message: 'Product removed' });
});
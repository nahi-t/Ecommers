import asyncHandler from 'express-async-handler';
import Category from '../models/catagory.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';  

import express from 'express';

// ────────────────────────────────────────────────
// CREATE CATEGORY (Admin only)
// ────────────────────────────────────────────────
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(400);
    throw new Error('Category with this name already exists');
  }

  const category = await Category.create({
    name,
    description,
    icon,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    category,
  });
});

// ────────────────────────────────────────────────
// GET ALL CATEGORIES (Public)
// ────────────────────────────────────────────────
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .select('name slug description icon');

  res.json({
    success: true,
    count: categories.length,
    categories,
  });
});

// ────────────────────────────────────────────────
// UPDATE CATEGORY (Admin only)
// ────────────────────────────────────────────────
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, isActive } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Update only provided fields
  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;
  if (isActive !== undefined) category.isActive = isActive;

  const updatedCategory = await category.save();

  res.json({
    success: true,
    category: updatedCategory,
  });
});

// ────────────────────────────────────────────────
// DELETE CATEGORY (Admin only)
// ────────────────────────────────────────────────
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Optional safety: check if any product uses this category
  const productsUsingCategory = await Product.countDocuments({ category: category._id });
  if (productsUsingCategory > 0) {
    res.status(400);
    throw new Error(`Cannot delete category. ${productsUsingCategory} products are using it.`);
  }

  await category.deleteOne();

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});
// ────────────────────────────────────────────────
// GET CATEGORY BY NAME (Public)
// ────────────────────────────────────────────────
export const getCategoryByName = asyncHandler(async (req, res) => {
  const { name } = req.params; // get name from URL: /api/categories/name/:name

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const category = await Category.findOne({ name: name }).select('name slug description icon');

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({
    success: true,
    category,
  });
});
// controllers/categoryController.js

export const getCategoryWithProducts = asyncHandler(async (req, res) => {
  const { id } = req.params; // can be ObjectId or slug

  let category;

  // Check if id is valid ObjectId, else treat as slug
  if (mongoose.Types.ObjectId.isValid(id)) {
    category = await Category.findById(id)
      .populate({
        path: 'products',
      // optional: only active products
      });
  } else {
    category = await Category.findOne({ slug: id })
      .populate({
        path: 'products',
      
      });
  }

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({
    success: true,
    category,
  });
});

export default {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryByName,

  getCategoryWithProducts,
};
// src/controllers/orderController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/order.js';
import Product from '../models/Product.js';

export const createOrder = asyncHandler(async (req, res) => {
  const {
    productId,
    quantity,
    totalPrice,
    shippingAddress,
    paymentMethod,
  } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check stock (optional)
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock');
  }

  const order = await Order.create({
    user: req.user._id,
    items: [
      {
        product: productId,
        quantity,
        price: product.price, // save price at time of order
      },
    ],
    totalPrice,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
  });

  // Optional: decrease product stock
  // product.stock -= quantity;
  // await product.save();

  res.status(201).json({
    success: true,
    order,
    message: 'Order created successfully',
  });
});

// Optional: get user's orders
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name price image')
    .sort('-createdAt');
  res.json(orders);
});
export default {
  createOrder,
  getUserOrders,
};
import asyncHandler from "express-async-handler";
import Cart from "../models/cart.js";

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size } = req.body;
  const userId = req.user.id;

  if (!productId || !size) {
    res.status(400);
    throw new Error("Product ID and size are required");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
  }

  // 🔍 find same product + same size
  const productIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size
  );

  if (productIndex > -1) {
    cart.items[productIndex].quantity += Number(quantity);
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      size: size,
    });
  }

  cart.updatedAt = Date.now();
  await cart.save();

  await cart.populate("items.product", "name price image");

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
});
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product",
    "name price image"
  );

  if (!cart) {
    return res.json({ items: [], totalPrice: 0 });
  }

  // Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  res.json({
    items: cart.items,
    totalPrice,
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  const item = cart.items.id(itemId);

  item.quantity = quantity;
  await cart.save();

  await cart.populate("items.product", "name price image");

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  res.json({ items: cart.items, totalPrice });
});



export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.body; // id of the cart item
  const userId = req.user.id;

  if (!itemId) {
    res.status(400);
    throw new Error("Cart item ID is required");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Remove the item
  cart.items = cart.items.filter(item => item._id.toString() !== itemId);

  await cart.save();

  // Optional: recalc total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Populate product details
  await cart.populate("items.product", "name price image");

  res.json({ success: true, items: cart.items, totalPrice });
});


export default { addToCart, getCart, updateCartItem, removeCartItem }; 

// src/store/cartStore.js
import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set, get) => ({
  cartItems: [],       // full items in cart
  total: 0,            // total price
  cartCount: 0,        // total number of items (sum of quantities)

  // --------------------------
  // INTERNAL HELPER: Update store from server response
  // --------------------------
  _updateFromResponse: (res) => {
    const items = res.data?.items || res.data?.cart?.items || [];
    const total = items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );
    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    set({ cartItems: items, total, cartCount: count });
  },

  // --------------------------
  // Fetch cart from backend (call on app load or login)
  // --------------------------
  initializeCart: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/cart/get', {
        headers: { Authorization: `Bearer ${token}` },
      });
      get()._updateFromResponse(res);
    } catch (err) {
      console.error('Failed to initialize cart:', err);
    }
  },

  // --------------------------
  // Add item to cart
  // --------------------------
  addToCart: async (productId, size,quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) return console.warn('User not logged in');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      get()._updateFromResponse(res);
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  },

  // --------------------------
  // Update quantity of a cart item
  // --------------------------
  updateQuantity: async (itemId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token || quantity < 1) return;

    try {
      const res = await axios.put(
        'http://localhost:5000/api/cart/update',
        { itemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      get()._updateFromResponse(res);
    } catch (err) {
      console.error('Update quantity failed:', err);
    }
  },

  // --------------------------
  // Remove an item from cart
  // --------------------------
  removeItem: async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.delete('http://localhost:5000/api/cart/remove', {
        headers: { Authorization: `Bearer ${token}` },
        data: { itemId },
      });

      get()._updateFromResponse(res);
    } catch (err) {
      console.error('Remove item failed:', err);
      // Optional: re-fetch cart if out of sync
      get().initializeCart();
    }
  },

  // --------------------------
  // Clear entire cart (logout or order complete)
  // --------------------------
  clearCart: () => set({ cartItems: [], total: 0, cartCount: 0 }),

  // --------------------------
  // Get cart count (for Navbar badge)
  // --------------------------
  getCartCount: () => get().cartCount,
}));

export default useCartStore;

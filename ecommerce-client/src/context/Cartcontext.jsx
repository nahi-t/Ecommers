import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/cart/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data.items || [];
      setCartItems(items);

      const calculatedTotal = items.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      setTotal(calculatedTotal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!token) return alert("Please login to add items");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(res.data.cart.items);
      const newTotal = res.data.cart.items.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      setTotal(newTotal);
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await axios.put(
        "http://localhost:5000/api/cart/update",
        { itemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(res.data.items);
      const newTotal = res.data.items.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      setTotal(newTotal);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      await axios.delete("http://localhost:5000/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { itemId },
      });

      const updatedItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedItems);

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      setTotal(newTotal);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;
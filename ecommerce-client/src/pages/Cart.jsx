// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

const Cart = () => {
  const { cartItems, total, updateQuantity, removeItem, initializeCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadCart = async () => {
      if (!token) {
        setError("Please log in to view your cart");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await initializeCart(); // fetches from backend via store
      } catch (err) {
        console.error("Cart load error:", err);
        setError("Failed to load your cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [token, initializeCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error max-w-md text-center">
          <span>{error}</span>
          <Link to="/login" className="btn btn-outline btn-sm mt-4">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-base-content">
            Your Cart
          </h1>
          <Link to="/products" className="btn btn-outline btn-md">
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="card bg-base-100 shadow-xl text-center py-16">
            <div className="card-body">
              <h2 className="text-2xl font-semibold mb-4 text-base-content">
                Your cart is empty 🛒
              </h2>
              <p className="text-base-content/70 mb-8">
                Looks like you haven't added anything yet.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6 mb-10">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    {/* Product Image */}
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={`http://localhost:5000${item.product?.image || "/placeholder.jpg"}`}
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">
                        {item.product?.name || "Product"}
                      </h2>
                      {item.size && (
                        <p className="text-sm opacity-70 mb-1">Size: {item.size}</p>
                      )}
                      <p className="text-lg font-bold text-primary mb-2">
                        {item.product?.price?.toLocaleString() || 0} ETB
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-4 sm:gap-6">
                      <div className="flex items-center gap-3">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="text-lg font-semibold min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <p className="text-lg font-bold text-primary">
                        {(item.product?.price * item.quantity || 0).toLocaleString()} ETB
                      </p>

                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary & Checkout */}
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body p-6 md:p-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span className="font-bold">{total.toLocaleString()} ETB</span>
                  </div>

                  <div className="flex justify-between text-lg">
                    <span>Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>

                  <div className="divider my-4"></div>

                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total.toLocaleString()} ETB</span>
                  </div>
                </div>

                <div className="card-actions mt-10">
                 <Link
  to={`/buy-now/${cartItems[0]?.product?._id}`}
  className="btn btn-primary btn-block btn-lg"
>
  Proceed to Checkout
</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
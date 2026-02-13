// src/pages/BuyNow.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import axios from 'axios';

const BuyNow = () => {
  const { id } = useParams(); // /buy-now/:id
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
 // Get cart items from store if needed
 

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cash_on_delivery',
  });

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/products/${id}`);
        setProduct(res.data);
        console
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Quantity +/- buttons
  const adjustQuantity = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Submit order to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product) return;

    setOrderLoading(true);
    setError(null);

    const orderData = {
      items: [
        {
          product: product._id,
          quantity,
          price: product.price,
        },
      ],
      totalPrice: product.price * quantity,
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      },
      paymentMethod: formData.paymentMethod,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first');

      await axios.post(`${API}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Order placed successfully!');
      navigate('/order-success'); // or any confirmation page
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      console.error(err);
    } finally {
      setOrderLoading(false);
    }
  };

  // Calculations
  const subtotal = product ? product.price * quantity : 0;
  const shipping = 300; // fixed – change as needed
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error max-w-md text-center">
          <span>{error || 'Product not found'}</span>
          <Link to="/products" className="btn btn-outline btn-sm mt-4">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-base-content">
          Buy Now
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Product + Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Summary */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-6 md:p-8">
                <h2 className="card-title text-2xl mb-6">Your Order</h2>

                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    // src={`${API}${product.image}`}
                     src={product.image} 
                    alt={product.name}
                    className="w-full sm:w-48 h-48 object-cover rounded-xl shadow-md"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/200')}
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold">{product.name}</h3>
                    <p className="text-xl mt-3 font-bold text-primary">
                      {product.price.toLocaleString()} ETB
                    </p>
                    {product.description && (
                      <p className="mt-3 opacity-80">{product.description}</p>
                    )}
                  </div>

                  <div className="text-right min-w-[140px]">
                    <p className="text-2xl font-bold text-primary">
                      {(product.price * quantity).toLocaleString()} ETB
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-8">
                  <label className="label">
                    <span className="label-text font-medium">Quantity</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => adjustQuantity(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold min-w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => adjustQuantity(1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-6 md:p-8">
                <h2 className="card-title text-2xl mb-6">Delivery & Payment</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="+251 9xx xxx xxx"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Address</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="textarea textarea-bordered h-28 w-full"
                      placeholder="Street, Sub-city, House number, Landmark..."
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City / Region</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Dire Dawa / Addis Ababa / ..."
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Method</span>
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="cash_on_delivery">Cash on Delivery</option>
                      <option value="telebirr">Telebirr</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="card-actions justify-end mt-10">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={orderLoading}
                    >
                      {orderLoading ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Placing Order...
                        </>
                      ) : (
                        `Place Order • ${total.toLocaleString()} ETB`
                      )}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="alert alert-error mt-6">
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-6">
              <div className="card-body">
                <h2 className="card-title text-xl mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Product</span>
                    <span className="font-medium text-right">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price × Qty</span>
                    <span>
                      {product.price.toLocaleString()} × {quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping.toLocaleString()} ETB</span>
                  </div>
                  <div className="divider my-4"></div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total.toLocaleString()} ETB</span>
                  </div>
                </div>

                <div className="mt-8 text-sm text-center opacity-70">
                  By placing this order you agree to our{' '}
                  <Link to="/terms" className="link link-primary">
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link to="/privacy" className="link link-primary">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
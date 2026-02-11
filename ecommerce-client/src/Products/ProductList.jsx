// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({}); // track size per product
  const [quantity, setQuantity] = useState({}); // track quantity per product
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);

        // Initialize size and quantity for each product
        const initialSizes = {};
        const initialQuantities = {};
        data.forEach((product) => {
          initialSizes[product._id] = product.size?.[0] || null;
          initialQuantities[product._id] = 1;
        });
        setSelectedSizes(initialSizes);
        setQuantity(initialQuantities);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    const size = selectedSizes[product._id];
    const qty = quantity[product._id] || 1;

    if (!size) {
      alert("Please select a size");
      return;
    }

    try {
      await addToCart(product._id, size, qty);
      alert(`Added ${qty} × ${product.name} (Size: ${size}) to cart!`);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

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
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-base-content text-center md:text-left">
          Our Products
        </h1>
        <p className="mt-3 text-base-content/70 text-center md:text-left">
          Discover our collection • {products.length} items
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="alert alert-info shadow-lg text-center">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <figure className="relative overflow-hidden">
                  <img
                    src={`${API}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.price && (
                    <div className="absolute top-3 right-3 badge badge-secondary badge-lg font-bold">
                      ${product.price.toFixed(2)}
                    </div>
                  )}
                </figure>

                <div className="card-body p-5">
                  <h2 className="card-title text-lg font-semibold line-clamp-2">
                    {product.title || product.name}
                  </h2>

                  <p className="text-sm text-base-content/70 line-clamp-2 min-h-[3rem]">
                    {product.description}
                  </p>

                  {/* Size selection */}
                  <div>
                    <label className="label font-semibold">Size</label>
                    <div className="flex gap-3 flex-wrap">
                      {product.size?.map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setSelectedSizes({ ...selectedSizes, [product._id]: size })
                          }
                          className={`btn btn-outline ${
                            selectedSizes[product._id] === size ? "btn-primary" : ""
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="form-control w-40 mt-3">
                    <label className="label font-semibold">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() =>
                          setQuantity({
                            ...quantity,
                            [product._id]: Math.max(1, quantity[product._id] - 1),
                          })
                        }
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={quantity[product._id] || 1}
                        onChange={(e) =>
                          setQuantity({
                            ...quantity,
                            [product._id]: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="input input-bordered w-20 text-center"
                      />

                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() =>
                          setQuantity({
                            ...quantity,
                            [product._id]: (quantity[product._id] || 1) + 1,
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/product/${product._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary flex-1 text-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
                    src={`http://localhost:5000${product.image}`}
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

                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.size?.map((s) => (
                      <div key={s} className="badge badge-outline badge-sm">
                        {s}
                      </div>
                    ))}
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/product/${product._id}`} // or wherever your detail page is
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                    <button className="btn btn-outline btn-sm">
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
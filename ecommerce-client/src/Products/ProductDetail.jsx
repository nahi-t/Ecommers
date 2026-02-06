// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams(); // from URL: /product/:id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        if (data.size?.length > 0) setSelectedSize(data.size[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    // In real app → use Cart context / Redux / localStorage
    alert(`Added ${quantity} × ${product.name} (Size: ${selectedSize}) to cart!`);
  };

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
        <div className="alert alert-error max-w-md shadow-lg">
          <span>{error || "Product not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image Section */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Optional thumbnails if you have multiple images */}
            {/* <div className="flex gap-4 mt-6">
              {[1,2,3].map((i) => (
                <div key={i} className="w-24 h-24 bg-base-100 rounded-lg cursor-pointer hover:ring-2 ring-primary">
                  <img src="..." alt="thumb" className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div> */}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-base-content">{product.title || product.name}</h1>
                <p className="text-xl text-primary font-semibold mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div className="prose max-w-none text-base-content/80">
                <p>{product.description}</p>
              </div>

              {/* Sizes */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Size</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.size?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`btn btn-outline ${selectedSize === size ? "btn-primary" : ""}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="form-control w-40">
                <label className="label">
                  <span className="label-text font-semibold">Quantity</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="input input-bordered w-20 text-center"
                    min="1"
                  />
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary flex-1 text-lg"
                >
                  Add to Cart
                </button>
                <button className="btn btn-outline flex-1 text-lg">
                  Buy Now
                </button>
              </div>

              {/* Additional info */}
              <div className="divider my-8"></div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold">Free Shipping</h3>
                  <p className="text-base-content/70">On orders over $50</p>
                </div>
                <div>
                  <h3 className="font-semibold">30-Day Returns</h3>
                  <p className="text-base-content/70">Easy returns policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to products */}
        <div className="mt-12 text-center">
          <Link to="/products" className="link link-primary text-lg">
            ← Back to all products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
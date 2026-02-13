import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import useCartStore from "../store/cartStore";

const ProductDetail = () => {
  const { id } = useParams(); // /product/:id
   const addToCart = useCartStore((state) => state.addToCart);
   const API=import.meta.env.VITE_API_URL ;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 🔹 Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        setProduct(data);

        if (data.size?.length > 0) {
          setSelectedSize(data.size[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔹 Add to cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
     addToCart(product._id, selectedSize,quantity);
    alert(`Added ${quantity} × ${product.name} (Size: ${selectedSize}) to cart!`);

    // try {
    //   const token = localStorage.getItem("token");

    //   const response = await axios.post(
    //     "http://localhost:5000/api/cart/add",
    //     {
    //       productId: product._id,
    //       quantity: quantity,
    //       size: selectedSize,
    //     },
    //     {
    //       headers: token
    //         ? { Authorization: `Bearer ${token}` }
    //         : {},
    //     }
    //   );

    //   console.log(response.data);
    //   alert("Added to cart ✅");
    // } catch (error) {
    //   console.error(error);
    //   alert("Failed to add to cart ❌");
    // }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 🔹 Error state
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
          
          {/* 🖼 Product Image */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
              <img
                  // src={`${API}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                    src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* 📄 Product Info */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">

              <div>
                <h1 className="text-4xl font-bold">
                  {product.title || product.name}
                </h1>
                <p className="text-xl text-primary font-semibold mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <p className="text-base-content/80">
                {product.description}
              </p>

              {/* 👕 Size */}
              <div>
                <label className="label font-semibold">Size</label>
                <div className="flex gap-3 flex-wrap">
                  {product.size?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`btn btn-outline ${
                        selectedSize === size ? "btn-primary" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 🔢 Quantity */}
              <div className="form-control w-40">
                <label className="label font-semibold">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                    className="input input-bordered w-20 text-center"
                  />

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 🛒 Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary flex-1 text-lg"
                >
                  Add to Cart
                </button>
<Link
  to={`/buy-now/${product._id}`}
  className="btn btn-primary btn-lg"
>
  Buy Now
</Link>
              </div>

              <div className="divider"></div>

              {/* ℹ Extra Info */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold">Free Shipping</h3>
                  <p className="opacity-70">On orders over $50</p>
                </div>
                <div>
                  <h3 className="font-semibold">30-Day Returns</h3>
                  <p className="opacity-70">Easy return policy</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 🔙 Back */}
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

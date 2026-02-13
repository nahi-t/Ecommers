// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import {img} from "./data.js"
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // ← import here or in main.jsx

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
   const API = import.meta.env.VITE_API_URL ;

  useEffect(() => {
   
    fetch(`${API}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  
 

  return (
    <div className="min-h-screen bg-base-200">
      {/* Carousel Section */}
      <div className="w-full mx-auto overflow-hidden rounded-xl shadow-2xl">
        <Carousel
          autoPlay={true}
          infiniteLoop={true}
          showIndicators={false}      // hide dots
          showThumbs={false}          // hide thumbnails
          showStatus={false}          // hide "1/3" status
          interval={5000}             // slide every 5 seconds
          transitionTime={800}        // smooth transition
          swipeable={true}
          emulateTouch={true}
          className="rounded-xl overflow-hidden"
        >
          {img.map((imgItem, index) => (
            <div key={index} className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              <img
                src={imgItem}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover brightness-75"
              />

              {/* Gradient overlay at bottom (like your original CSS) */}
              <div className="absolute bottom-0 left-0 w-full h-48 md:h-56 lg:h-64 
                             bg-gradient-to-t from-white via-white/80 to-transparent 
                             dark:from-base-100 dark:via-base-100/80 dark:to-transparent" />

              {/* Optional: Text overlay on each slide */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-10">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl">
                  {index === 0 ? "New Collection 2025" : 
                   index === 1 ? "Summer Sale Live!" : "Premium Quality"}
                </h2>
                <p className="text-lg md:text-2xl mb-6 drop-shadow-xl">
                  {index === 0 ? "Up to 50% off selected items" :
                   index === 1 ? "Free shipping on orders over $50" : "Shop luxury furniture now"}
                </p>
                <Link
                  to="/products"
                  className="btn btn-primary btn-lg uppercase tracking-wider shadow-lg hover:shadow-xl"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-base-content">
          Featured Products
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <figure className="px-6 pt-6">
                  <img
                  // src={`${API}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
            src={product.image} 
                    alt={product.name}
                    className="rounded-xl h-64 w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </figure>
                <div className="card-body pt-4">
                  <h2 className="card-title text-lg line-clamp-2">
                    {product.title || product.name}
                  </h2>
                  <p className="text-xl font-bold text-primary">
                    ${product.price?.toFixed(2)}
                  </p>
                  <div className="card-actions justify-end mt-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/products" className="btn btn-outline btn-lg">
            View All Products →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
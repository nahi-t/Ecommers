import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../Products/ProductDetail';


const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products by category slug
        const res = await axios.get(
          `http://localhost:5000/api/products?category=${encodeURIComponent(slug)}`
        );

        setProducts(res.data);

        // Set page title (you can fetch category name separately if needed)
        setCategoryName(
          slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
        );
      } catch (err) {
        setError('Failed to load products in this category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-base-content">
              {categoryName}
            </h1>
            <p className="text-base-content/70 mt-2">
              Browse our collection of {categoryName.toLowerCase()}
            </p>
          </div>

          <Link to="/products" className="btn btn-outline">
            Back to All Products
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-2xl mx-auto text-center">
            <span>{error}</span>
          </div>
        ) : products.length === 0 ? (
          <div className="card bg-base-100 shadow-xl text-center py-16">
            <div className="card-body">
              <h2 className="text-2xl font-semibold mb-4">
                No products found in "{categoryName}"
              </h2>
              <p className="text-base-content/70 mb-8">
                Check back later or browse other categories.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">
                See All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
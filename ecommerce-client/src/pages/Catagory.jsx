import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const CategoryDetail = () => {
  const { id } = useParams(); // slug or ID
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${API}/api/categories/${id}/products`);
        if (!res.data.success) throw new Error('Failed to fetch category');

        setCategory(res.data.category); // category includes products
        console.log('Fetched category with products:', res.data.category);
      } catch (err) {
        console.error('Fetch error:', err);
        const msg = err.response?.data?.message || err.message || 'Category not found';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="alert alert-error max-w-2xl shadow-xl text-center">
          <h3 className="font-bold">Error</h3>
          <p>{error || 'Category not found'}</p>
          <p className="text-xs mt-2 opacity-80">
            Tried category: <code>{id}</code>
          </p>
          <Link to="/products" className="btn btn-outline btn-sm mt-4">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <span className="text-6xl">{category.icon || '📁'}</span>
            <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
          </div>
          {category.description && (
            <p className="text-lg text-base-content/80 max-w-3xl mx-auto md:mx-0">
              {category.description}
            </p>
          )}
        </div>

        {/* Products Section */}
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">
          Products in {category.name} ({category.products.length})
        </h2>

        {category.products.length === 0 ? (
          <div className="alert alert-info shadow-lg text-center py-12 max-w-2xl mx-auto">
            No products available in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {category.products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`} // link to product details
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                <figure className="relative overflow-hidden h-64 md:h-72">
                  <img
                                    // src={`${API}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                                     src={product.image} 
                    alt={product.name || product.title || 'Product'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => (e.target.src = '/placeholder-product.jpg')}
                  />
                  <div className="absolute top-3 right-3 badge badge-secondary badge-lg font-bold shadow-md">
                    {Number(product.price).toLocaleString()} ETB
                  </div>
                </figure>

                <div className="card-body p-5">
                  <h2 className="card-title text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title || product.name || 'Unnamed Product'}
                  </h2>
                  <p className="text-sm text-base-content/70 line-clamp-2 min-h-[3rem] mb-4">
                    {product.description || 'No description available'}
                  </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">View Details</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/products" className="btn btn-outline btn-lg">
            ← Back to All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;

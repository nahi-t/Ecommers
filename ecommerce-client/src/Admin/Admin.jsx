// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    price: '',
    size: '',
    image: null,
  });
  const [preview, setPreview] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch {
      showMessage('error', 'Failed to load products');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ title: '', name: '', description: '', price: '', size: '', image: null });
    setPreview('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      name: product.name,
      description: product.description,
      price: product.price,
      size: product.size.join(', '),
      image: null,
    });
    setPreview(product.image ? `http://localhost:5000${product.image}` : '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.name || !formData.description || !formData.price || !formData.size) {
      showMessage('error', 'All fields are required');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('size', formData.size);
    if (formData.image) data.append('image', formData.image);

    try {
      const token = localStorage.getItem('token');
      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Operation failed');
      }

      showMessage('success', editingProduct ? 'Product updated!' : 'Product added!');
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');
      showMessage('success', 'Product deleted');
      fetchProducts();
    } catch (err) {
      showMessage('error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-base-content">Admin Product Management</h1>
        <button onClick={openAddModal} className="btn btn-primary">
          + Add New Product
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6 shadow-lg`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="alert alert-info shadow-lg text-center">
          No products found. Add your first product!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="px-6 pt-6">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="rounded-xl object-contain h-48 w-full"
                />
              </figure>
              <div className="card-body pt-4">
                <h2 className="card-title text-lg">{product.title}</h2>
                <p className="text-sm text-base-content/70">{product.name}</p>
                <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                <div className="badge badge-outline badge-secondary mt-1">
                  Sizes: {product.size.join(', ')}
                </div>
                <div className="card-actions justify-end mt-4 gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <input type="checkbox" id="product-modal" className="modal-toggle" checked={showModal} readOnly />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box max-w-2xl">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>

          <h3 className="font-bold text-2xl mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Title</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered h-28"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Price ($)</span>
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Sizes (comma separated)</span>
                </label>
                <input
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Product Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full"
              />
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-48 h-48 object-contain rounded-lg border border-base-300 mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="modal-action mt-8">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Saving...
                  </>
                ) : editingProduct ? (
                  'Update Product'
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
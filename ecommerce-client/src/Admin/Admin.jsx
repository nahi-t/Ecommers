// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  // ─── Product State ───
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    price: '',
    size: '',
    image: null,
    category: '',
  });
  const [preview, setPreview] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // ─── Category State ───
  const [categories, setCategories] = useState([]); // ← important: start as empty array
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    icon: '',
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Shared states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ─── Fetch Data ───
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      showMessage('error', 'Failed to load products');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
       setCategories(Array.isArray(res.data.categories) ? res.data.categories : []);
 // ensure array
    } catch (err) {
      showMessage('error', 'Failed to load categories');
      setCategories([]); // reset to empty on error
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // ─── Product Handlers ───
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      name: '',
      description: '',
      price: '',
      size: '',
      image: null,
      category: '',
    });
    setPreview('');
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      size: product.size?.join(', ') || '',
      image: null,
      category: product.category?._id || product.category || '',
    });
    setPreview(product.image ? `http://localhost:5000${product.image}` : '');
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.name || !formData.description || !formData.price || !formData.size || !formData.category) {
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
    data.append('category', formData.category);
    if (formData.image) data.append('image', formData.image);

    try {
      const token = localStorage.getItem('token');
      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      showMessage('success', editingProduct ? 'Product updated!' : 'Product added!');
      setShowProductModal(false);
      fetchProducts();
    } catch (err) {
      showMessage('error', err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage('success', 'Product deleted');
      fetchProducts();
    } catch (err) {
      showMessage('error', 'Failed to delete product');
    }
  };

  // ─── Category Handlers ───
  const handleCategoryChange = (e) => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value });
  };

  const openAddCategory = () => {
    setEditingCategory(null);
    setCatForm({ name: '', description: '', icon: '' });
    setShowCategoryModal(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || '',
    });
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!catForm.name.trim()) {
      showMessage('error', 'Category name is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let res;

      if (editingCategory) {
        res = await axios.put(
          `http://localhost:5000/api/categories/${editingCategory._id}`,
          catForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showMessage('success', 'Category updated!');
      } else {
        res = await axios.post(
          'http://localhost:5000/api/categories',
          catForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showMessage('success', 'Category created!');
      }

      // Refresh list
      fetchCategories();
      setShowCategoryModal(false);
      setCatForm({ name: '', description: '', icon: '' });
      setEditingCategory(null);
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Products using it may become invalid.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage('success', 'Category deleted');
      fetchCategories();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-base-content">
          Admin Dashboard
        </h1>
        <div className="flex flex-wrap gap-3">
          <button onClick={openAddProduct} className="btn btn-primary">
            + Add Product
          </button>
          <button onClick={openAddCategory} className="btn btn-success">
            + Add Category
          </button>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-8 shadow-lg`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Categories Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

        {/* Category Form */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title text-xl mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleCategorySubmit} className="space-y-5">
              <div className="form-control">
                <label className="label"><span className="label-text">Name *</span></label>
                <input
                  type="text"
                  name="name"
                  value={catForm.name}
                  onChange={handleCategoryChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Description (optional)</span></label>
                <textarea
                  name="description"
                  value={catForm.description}
                  onChange={handleCategoryChange}
                  className="textarea textarea-bordered h-24 w-full"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Icon (optional)</span></label>
                <input
                  type="text"
                  name="icon"
                  value={catForm.icon}
                  onChange={handleCategoryChange}
                  className="input input-bordered w-full"
                  placeholder="e.g. 🛋️ or fas fa-couch"
                />
              </div>

              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    className="btn btn-outline ml-3"
                    onClick={() => {
                      setEditingCategory(null);
                      setCatForm({ name: '', description: '', icon: '' });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Category List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-xl mb-6">Existing Categories</h3>

            {categories.length === 0 ? (
              <p className="text-center opacity-70 py-8">No categories yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Description</th>
                      <th>Icon</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(categories) && categories.map((cat) => (
                      <tr key={cat._id}>
                        <td className="font-medium">{cat.name}</td>
                        <td>{cat.slug}</td>
                        <td className="max-w-xs truncate">{cat.description || '-'}</td>
                        <td>{cat.icon || '-'}</td>
                        <td className="space-x-2">
                          <button
                            onClick={() => openEditCategory(cat)}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="btn btn-sm btn-error"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Manage Products</h2>

        <button onClick={openAddProduct} className="btn btn-primary mb-8">
          + Add New Product
        </button>

        {/* Product List */}
        {products.length === 0 ? (
          <div className="alert alert-info">No products yet</div>
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
                  <p className="text-sm opacity-70">{product.name}</p>
                  <p className="text-xl font-bold text-primary mt-2">
                    {product.price.toLocaleString()} ETB
                  </p>
                  <div className="badge badge-outline badge-secondary mt-2">
                    {product.category?.name || 'No category'}
                  </div>
                  <div className="card-actions justify-end mt-4 gap-2">
                    <button
                      onClick={() => openEditProduct(product)}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
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
      </div>

      {/* ─── Product Modal ─── */}
      <input type="checkbox" id="product-modal" className="modal-toggle" checked={showProductModal} readOnly />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box max-w-2xl">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowProductModal(false)}
          >
            ✕
          </button>

          <h3 className="font-bold text-2xl mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>

          <form onSubmit={handleProductSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label"><span className="label-text">Title</span></label>
              <input
                name="title"
                value={formData.title}
                onChange={handleProductChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input
                name="name"
                value={formData.name}
                onChange={handleProductChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Description</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleProductChange}
                className="textarea textarea-bordered h-28 w-full"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label"><span className="label-text">Price (ETB)</span></label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleProductChange}
                  className="input input-bordered w-full"
                  required
                  min="0"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Sizes (comma separated)</span></label>
                <input
                  name="size"
                  value={formData.size}
                  onChange={handleProductChange}
                  className="input input-bordered w-full"
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Image URL</span></label>
              <input
                type="file"
                name="image"
                value={formData.image || ''}
                onChange={handleProductChange}
                className="input input-bordered w-full"
                placeholder="https://..."
              />
              {preview && (
                <div className="mt-4">
                  <img src={preview} alt="preview" className="w-32 h-32 object-contain rounded-lg mx-auto" />
                </div>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="form-control">
              <label className="label"><span className="label-text">Category *</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleProductChange}
                className="select select-bordered w-full"
                required
                disabled={categories.length === 0}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action mt-8">
              <button type="button" className="btn btn-outline" onClick={() => setShowProductModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingProduct ? 'Update' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Modal */}
      <input type="checkbox" id="category-modal" className="modal-toggle" checked={showCategoryModal} readOnly />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box max-w-lg">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowCategoryModal(false)}
          >
            ✕
          </button>

          <h3 className="font-bold text-2xl mb-6">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>

          <form onSubmit={handleCategorySubmit} className="space-y-5">
            <div className="form-control">
              <label className="label"><span className="label-text">Name *</span></label>
              <input
                type="text"
                name="name"
                value={catForm.name}
                onChange={handleCategoryChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Description (optional)</span></label>
              <textarea
                name="description"
                value={catForm.description}
                onChange={handleCategoryChange}
                className="textarea textarea-bordered h-24 w-full"
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Icon (optional)</span></label>
              <input
                type="text"
                name="icon"
                value={catForm.icon}
                onChange={handleCategoryChange}
                className="input input-bordered w-full"
                placeholder="e.g. 🛋️"
              />
            </div>

            <div className="modal-action mt-8">
              <button type="button" className="btn btn-outline" onClick={() => setShowCategoryModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingCategory ? 'Update' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
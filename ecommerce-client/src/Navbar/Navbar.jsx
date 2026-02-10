// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import useCartStore from '../store/cartStore';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCartStore();

  const [categories, setCategories] = useState([]);

  // Safe user parsing
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  })();

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    useCartStore.getState().clearCart();
    navigate('/login');
  };

  // Fetch categories once on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(Array.isArray(res.data.categories) ? res.data.categories : []))
      .catch(err => console.error('Failed to load categories for navbar', err));
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-4 md:px-8 border-b border-base-200/50">
      {/* Start - Logo + Mobile Menu */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-2xl md:text-3xl font-extrabold">
          <span className="text-primary">Ecomm</span>
          <span className="text-base-content">Pro</span>
        </Link>

        {/* Mobile Hamburger */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-200">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>

            {/* Mobile Categories */}
            <li className="menu-title mt-2">Categories</li>
            {categories.length === 0 ? (
              <li><span className="text-sm opacity-70 pl-4">Loading...</span></li>
            ) : (
              categories.map((cat) => (
                <li key={cat._id}>
                 <Link to={`/category/${cat._id}`}> {cat.name} </Link>
                </li>
              ))
            )}
            <li><Link to="/products">All Products</Link></li>

            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>

            {user && (
              <>
                <li className="menu-title mt-2">Account</li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><Link to="/cart">Cart ({cartCount || 0})</Link></li>
                {user?.role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Center - Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/" className="text-base font-medium">Home</Link></li>
          <li><Link to="/products" className="text-base font-medium">Shop</Link></li>

          {/* Category Dropdown */}
          <li tabIndex={0}>
            <details>
              <summary className="text-base font-medium">Categories</summary>
              <ul className="p-2 bg-base-100 rounded-t-none shadow-md border border-base-200 min-w-[180px]">
                {categories.length === 0 ? (
                  <li><span className="text-sm opacity-70 px-4">Loading...</span></li>
                ) : (
                  Array.isArray(categories) && categories.map((cat) => (
                    <li key={cat._id}>
                      <Link to={`/category/${cat.slug}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))
                )}
                <li className="menu-title mt-2">
                  <Link to="/products">All Products</Link>
                </li>
              </ul>
            </details>
          </li>

          <li><Link to="/about" className="text-base font-medium">About</Link></li>
          <li><Link to="/contact" className="text-base font-medium">Contact</Link></li>
        </ul>
      </div>

      {/* End - Actions */}
      <div className="navbar-end flex items-center gap-3 md:gap-5">
        <ThemeToggle />

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="btn btn-ghost btn-circle relative hover:bg-base-200 transition-colors duration-200"
          title="View Cart"
        >
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="indicator-item badge badge-error badge-sm font-bold">
                {cartCount}
              </span>
            )}
          </div>
        </Link>

        {/* User / Login */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`}
                  alt="avatar"
                />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-56 border border-base-200">
              <li className="menu-title text-sm opacity-70 px-3 py-1">
                {user.name || user.email}
              </li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li>
                <Link to="/cart">
                  My Cart
                  {cartCount > 0 && <span className="badge badge-neutral badge-sm ml-2">{cartCount}</span>}
                </Link>
              </li>
              {user?.role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
              <li className="divider my-1"></li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-outline btn-sm md:btn-md rounded-full px-6">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
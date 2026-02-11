// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import useCartStore from '../store/cartStore';
import axios from 'axios';

const Navbar = () => {
  const API = import.meta.env.VITE_API_URL;
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

  useEffect(() => {
    axios
      .get(`${API}/api/categories`)
      .then((res) =>
        setCategories(
          Array.isArray(res.data.categories) ? res.data.categories : []
        )
      )
      .catch((err) => console.error('Failed to load categories for navbar', err));
  }, [API]);

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-4 md:px-8 border-b border-base-200/50">
      {/* Start - Logo + Mobile Menu */}
      <div className="navbar-start">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-2xl md:text-3xl font-extrabold"
        >
          <span className="text-primary">Ecomm</span>
          <span className="text-base-content">Pro</span>
        </Link>

        {/* Mobile Hamburger */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-64 border border-base-200"
          >
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>

            <li className="menu-title mt-2">Categories</li>
            {categories.length === 0 ? (
              <li>
                <span className="text-sm opacity-70 pl-4">Loading...</span>
              </li>
            ) : (
              categories.map((cat) => (
                <li key={cat._id}>
                  <Link to={`/category/${cat._id}/products`}>{cat.name}</Link>
                </li>
              ))
            )}
            <li>
              <Link to="/products">All Products</Link>
            </li>

            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>

            {user ? (
              <>
                <li className="menu-title mt-4">Account</li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li>
                  <Link to="/cart">
                    Cart ({cartCount || 0})
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li><Link to="/admin">Admin Dashboard</Link></li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-4">
                <Link to="/login" className="btn btn-outline btn-sm w-full">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Center - Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Shop</Link></li>

          <li tabIndex={0}>
            <details>
              <summary>Categories</summary>
              <ul className="p-2 bg-base-100 rounded-t-none shadow-md border border-base-200 min-w-[200px]">
                {categories.length === 0 ? (
                  <li>
                    <span className="text-sm opacity-70 px-4">Loading...</span>
                  </li>
                ) : (
                  categories.map((cat) => (
                    <li key={cat._id}>
                     <Link to={`/category/${cat._id}/products`}>{cat.name}</Link>
                    </li>
                  ))
                )}
                <li className="menu-title mt-2">
                  <Link to="/products">All Products</Link>
                </li>
              </ul>
            </details>
          </li>

          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>

      {/* End - Cart + Theme + User/Login */}
      <div className="navbar-end flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="btn btn-ghost btn-circle relative"
          title="Cart"
        >
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="indicator-item badge badge-error badge-sm">
                {cartCount}
              </span>
            )}
          </div>
        </Link>

        {/* User / Login */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || 'User'
                  )}&background=random`}
                  alt="avatar"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <span>{user.name || user.email}</span>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/cart">Cart ({cartCount || 0})</Link>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <Link to="/admin">Admin Dashboard</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-outline btn-sm md:btn-md">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
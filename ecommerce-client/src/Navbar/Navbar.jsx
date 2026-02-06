// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle'; // keep commented if not using

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Safe user parsing
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-4 md:px-8">
      {/* Left - Logo + mobile menu */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold">
          <span className="text-primary">Ecomm</span>Pro
        </Link>

        {/* Mobile hamburger */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
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
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      {/* Center - Desktop navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Shop</Link></li>
          <li tabIndex={0}>
            <details>
              <summary>Categories</summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li><Link to="/products?category=sofas">Sofas</Link></li>
                <li><Link to="/products?category=tables">Tables</Link></li>
                <li><Link to="/products?category=chairs">Chairs</Link></li>
                <li><Link to="/products?category=lamps">Lamps</Link></li>
              </ul>
            </details>
          </li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
      <ThemeToggle />

      {/* Right side - Only user/login (no search, no cart) */}
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
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
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin">Admin Dashboard</Link></li>
              )}
              <li>
                <button onClick={handleLogout}>Logout</button>
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
// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";           // fixed capitalization: HOme → Home
import Products from "./Products/ProductList";
import ProductDetail from "./Products/ProductDetail";
import Admin from "./Admin/Admin";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import { useEffect } from "react";
import useCartStore from "./store/cartStore";
import BuyNow from "./pages/BuyNow";
import CategoryPage from "./pages/Catagory";


// Optional: 404 page (recommended)
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
    <h1 className="text-6xl font-bold text-base-content">404</h1>
    <p className="text-2xl mt-4 mb-8">Page not found</p>
    <button className="btn btn-primary" onClick={() => window.history.back()}>
      Go Back
    </button>
  </div>
);

function App() {
   const initializeCart = useCartStore((state) => state.initializeCart);

  useEffect(() => {
    initializeCart();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar always visible */}
      <Navbar />

      {/* Main content takes remaining space */}
      <main className="flex-1">
        
       <Routes>
  {/* Public */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/home" element={<Home />} />
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/products" element={<Products />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/cart" element={<Cart />} /> 
 <Route path="/buy-now/:id" element={<BuyNow />} />
 <Route path="/category/:id/products" element={<CategoryPage />} />
  </Route>

  {/* Admin only */}
  <Route element={<ProtectedRoute adminOnly />}>
    <Route path="/admin" element={<Admin />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
      </main>

      {/* Optional: Footer */}
      {/* <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>© 2025 EcommPro – All rights reserved</p>
        </div>
      </footer> */}
    </div>
  );
}

export default App;
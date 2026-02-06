import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false }) => {
  const location = useLocation();

  // Retrieve both from localStorage
  const token = localStorage.getItem("token"); // Usually a string
  const user = JSON.parse(localStorage.getItem("user")); // Usually an object

  // 1. Check if the token OR user is missing
  if (!token || !user) {
    // Redirect to login and save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check for Admin access if required
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // 3. Authorized! Render the child components
  return <Outlet />;
};

export default ProtectedRoute;
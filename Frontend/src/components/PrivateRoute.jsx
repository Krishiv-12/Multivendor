import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem("role");
  const isVerified = localStorage.getItem("isVerified");
  const token = localStorage.getItem("token");


  if (!token) return <Navigate to="/login" />;
  if (isVerified !== "true") return <Navigate to="/verify-otp" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/" />;

  return <Outlet />
};

export default PrivateRoute;

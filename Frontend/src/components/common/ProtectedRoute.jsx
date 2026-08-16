import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // Wait until authentication is checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User does not have the required role
  if (roles && !roles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "technician") {
      return <Navigate to="/technician/dashboard" replace />;
    }

    return <Navigate to="/user/dashboard" replace />;
  }

  // User is logged in and has permission
  return children;
}
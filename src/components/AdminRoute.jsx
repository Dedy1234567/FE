import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {

  const { user } = useAuth();

  // Belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Bukan admin
  if (
    user.role?.toUpperCase() !== "ADMIN"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

export default function AdminRoute() {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/admin/login" replace />;
  if (auth.role !== ROLES.ADMIN) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}

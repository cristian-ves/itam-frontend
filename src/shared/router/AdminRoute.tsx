import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = () => {
  const { user } = useAuth();
  return user?.rol === "Administrador" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

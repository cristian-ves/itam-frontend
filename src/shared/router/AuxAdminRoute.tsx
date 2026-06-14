import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AuxAdminRoute = () => {
  const { user } = useAuth();
  return user?.rol === "Administrador" || user?.rol === "Auxiliar" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

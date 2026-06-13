import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/atoms/Spinner";

export const PrivateRoute = () => {
  const { isAuthenticated, isRestoring } = useAuth();

  if (isRestoring)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spinner size="lg" label="Cargando sesión..." />
      </div>
    );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

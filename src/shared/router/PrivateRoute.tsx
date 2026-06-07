import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export const PrivateRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // cuando se termine de crear el dash: quitar este return.
  return <Outlet />;
  // descomentar la linea de abajo.
  //return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

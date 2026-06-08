import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

// Public pages
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../../features/auth/pages/LoginPage";

// Protected pages
import { AssignmentsPage } from "../../features/assignments/pages/AssignmentsPage";
import { MaintenancePage } from "../../features/maintenance/pages/MaintenancePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { DashboardPage } from "../pages/DashboardPage";
import { AssetsLayout } from "../../features/assets/layout/AssetsLayout";
import {
  LaboratoriosPage,
  LicenciasPage,
  ProyectoresPage,
  ServidoresPage,
} from "../../features/assets/pages";

const router = createBrowserRouter([
  // Always public
  { path: "/", element: <LandingPage /> },

  // Public
  {
    element: <PublicRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },

  // Protected
  {
    element: <PrivateRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },

      {
        path: "/activos",
        element: <AssetsLayout />,
        children: [
          { index: true, element: <Navigate to="laboratorios" replace /> },
          { path: "laboratorios", element: <LaboratoriosPage /> },
          { path: "servidores", element: <ServidoresPage /> },
          { path: "proyectores", element: <ProyectoresPage /> },
          { path: "licencias", element: <LicenciasPage /> },
        ],
      },

      { path: "/asignaciones", element: <AssignmentsPage /> },
      { path: "/mantenimiento", element: <MaintenancePage /> },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);

export default router;

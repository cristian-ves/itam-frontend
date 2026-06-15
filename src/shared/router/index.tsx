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
import { PerfilPage } from "../../features/auth/pages/PerfilPage";
import { ReportesPage } from "../../features/reportes/pages/ReportesPage";
import { UsuariosPage } from "../../features/users/pages/UsuariosPage";
import { AdminRoute } from "./AdminRoute";
import { AuxAdminRoute } from "./AuxAdminRoute";
import { CargaMasivaPage } from "../../features/carga-masiva/pages/CargaMasivaPage";

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

      {
        element: <AdminRoute />,
        children: [{ path: "/usuarios", element: <UsuariosPage /> }],
      },
      {
        element: <AuxAdminRoute />,
        children: [{ path: "/reportes", element: <ReportesPage /> }],
      },
      { path: "/perfil", element: <PerfilPage /> },
      { path: "/asignaciones", element: <AssignmentsPage /> },
      { path: "/mantenimiento", element: <MaintenancePage /> },
      { path: "/carga-masiva", element: <CargaMasivaPage /> },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);

export default router;

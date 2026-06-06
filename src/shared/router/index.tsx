import { createBrowserRouter } from "react-router-dom"
import { PrivateRoute } from "./PrivateRoute"
import { PublicRoute } from "./PublicRoute"

// Public pages
import { LandingPage } from "../pages/LandingPage"
import { LoginPage } from "../../features/auth/pages/LoginPage"

// Protected pages
import { AssetsPage } from "../../features/assets/pages/AssetsPage"
import { AssignmentsPage } from "../../features/assignments/pages/AssignmentsPage"
import { LicensesPage } from "../../features/licenses/pages/LicensesPage"
import { MaintenancePage } from "../../features/maintenance/pages/MaintenancePage"
import { NotFoundPage } from "../pages/NotFoundPage"
import { DashboardPage } from "../pages/DashboardPage"

const router = createBrowserRouter([
  // Always public 
  { path: "/", element: <LandingPage /> },

  // Public
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> }
    ]
  },

  // Protected 
  {
    element: <PrivateRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/assets", element: <AssetsPage /> },
      { path: "/assignments", element: <AssignmentsPage /> },
      { path: "/licenses", element: <LicensesPage /> },
      { path: "/maintenance", element: <MaintenancePage /> },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> }
])

export default router
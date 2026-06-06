import { createBrowserRouter } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"

// Public pages
import { LandingPage } from "../pages/LandingPage"
import { LoginPage } from "../../features/auth/pages/LoginPage"

// Protected pages
import { AssetsPage } from "../../features/assets/pages/AssetsPage"
import { AssignmentsPage } from "../../features/assignments/pages/AssignmentsPage"
import { LicensesPage } from "../../features/licenses/pages/LicensesPage"
import { MaintenancePage } from "../../features/maintenance/pages/MaintenancePage"

const router = createBrowserRouter([
  // Public 
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },

  // Protected 
  {
    element: <PrivateRoute />,
    children: [
      { path: "/assets", element: <AssetsPage /> },
      { path: "/assignments", element: <AssignmentsPage /> },
      { path: "/licenses", element: <LicensesPage /> },
      { path: "/maintenance", element: <MaintenancePage /> },
    ],
  },
])

export default router
import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"

export const PublicRoute = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

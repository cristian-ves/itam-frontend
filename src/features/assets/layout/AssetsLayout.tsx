import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export const AssetsLayout = () => {
  const { pathname } = useLocation();

  if (pathname === "/activos" || pathname === "/activos/") {
    return <Navigate to="/activos/laboratorios" replace />;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Control De Activos
          </h1>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

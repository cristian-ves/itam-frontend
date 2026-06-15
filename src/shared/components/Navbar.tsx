import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

const navLinks = [
  { to: "/dashboard", text: "Dashboard" },
  { to: "/activos/laboratorios", text: "Activos" },
  { to: "/asignaciones", text: "Asignaciones" },
  { to: "/mantenimiento", text: "Mantenimiento" },
];

export const Navbar = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation()

  const isActivosActive = pathname.startsWith("/activos")

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 shrink-0">
      <nav className="flex items-center gap-1">
        {navLinks.map(({ to, text }) => {
          const isActivos = to === "/activos/laboratorios"
          const isActive = isActivos ? pathname.startsWith("/activos") : pathname === to

          return (
            <NavLink
              key={to}
              to={to}
              className={() =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              {text}
            </NavLink>
          )
        })}
        {user?.rol === "Administrador" && (
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            Usuarios
          </NavLink>
        )}
        {(user?.rol === "Administrador" || user?.rol === "Auxiliar") && (
          <NavLink
            to="/reportes"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            Reportes
          </NavLink>
        )}
      </nav>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-400">
          {user?.name}
        </span>
        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `cursor-pointer p-1.5 rounded-md transition-colors duration-150 ${isActive
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`
          }
        >
          <UserCircle size={20} />
        </NavLink>
        <button className="cursor-pointer rounded-md bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-400 transition-colors duration-150">
          Carga Masiva
        </button>
        <button
          onClick={handleLogout}
          className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors duration-150"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

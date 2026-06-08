import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { to: "/dashboard", text: "Dashboard" },
  { to: "/activos/laboratorios", text: "Activos" },
  { to: "/asignaciones", text: "Asignaciones" },
  { to: "/mantenimiento", text: "Mantenimiento" },
];

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 shrink-0">
      <nav className="flex items-center gap-1">
        {navLinks.map(({ to, text }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            {text}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-400">
          {user?.name}
        </span>
        <button className="rounded-md bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-400 transition-colors duration-150">
          Carga Masiva
        </button>
      </div>
    </header>
  );
};

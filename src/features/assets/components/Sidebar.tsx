import { NavLink } from "react-router-dom";

interface SidebarLink {
  to: string;
  text: string;
}

const sidebarLinks: SidebarLink[] = [
  { to: "/activos/laboratorios", text: "Laboratorios" },
  { to: "/activos/listado", text: "Listado" },
  { to: "/activos/servidores", text: "Servidores" },
  { to: "/activos/proyectores", text: "Proyectores" },
  { to: "/activos/licencias", text: "Licencias de Software" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 p-5 text-white shrink-0 overflow-y-auto">
      <div className="mb-6 px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Activos
        </p>
      </div>
      <nav>
        <ul className="flex flex-col gap-1">
          {sidebarLinks.map(({ text, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `block rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                {text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

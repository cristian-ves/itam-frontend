import { Link } from "react-router-dom";

export const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5 text-white">
        <div className="mb-10 text-center">
          <Link to="/dashboard" className="text-2xl font-bold text-white">
            ITAM
          </Link>
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/laboratorios"
                className="block rounded px-4 py-2.5 transition duration-200 hover:bg-gray-700"
              >
                Laboratorios
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/servidores"
                className="block rounded px-4 py-2.5 transition duration-200 hover:bg-gray-700"
              >
                Servidores
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/proyectores"
                className="block rounded px-4 py-2.5 transition duration-200 hover:bg-gray-700"
              >
                Proyectores
              </Link>
            </li>
            <li>
              <Link
                to="/licencias"
                className="block rounded px-4 py-2.5 transition duration-200 hover:bg-gray-700"
              >
                Licencias de Software
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Control De Activos
          </h1>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-600">username</span>
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              Carga Masiva
            </button>
          </div>
        </header>
      </main>
    </div>
  );
};

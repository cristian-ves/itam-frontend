import React from "react";

export const DashboardPage = () => {
  return (
    <main className="flex-1 p-8 bg-gray-50 overflow-y-auto h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
        <p className="text-gray-500 mt-1">
          Resumen del estado de los activos de TI y alertas del sistema.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total de Activos
            </p>
            <h3 className="text-3xl font-bold text-gray-900">1,248</h3>
            <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                ></path>
              </svg>
              +12 este mes
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 2: Assigned */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Activos Asignados
            </p>
            <h3 className="text-3xl font-bold text-gray-900">892</h3>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              71% del inventario
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 3: Available */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Activos Disponibles
            </p>
            <h3 className="text-3xl font-bold text-gray-900">315</h3>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              25% del inventario
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 4: In Maintenance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              En Reparación
            </p>
            <h3 className="text-3xl font-bold text-gray-900">41</h3>
            <p className="text-xs text-red-500 mt-2 flex items-center font-medium">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              Requieren atención
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Section: Charts / Main visual data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Placeholder for Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Activos por Categoría
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver reporte
            </button>
          </div>
          <div className="h-64 flex items-end justify-around space-x-2 pb-4 border-b border-gray-100">
            {/* Mock bars */}
            <div className="flex flex-col items-center group w-full">
              <div className="w-full max-w-[5rem] bg-blue-500 rounded-t-md h-48 transition-all group-hover:bg-blue-600"></div>
              <span className="text-xs text-gray-500 mt-3 font-medium text-center">
                Equipos de Cómputo
              </span>
            </div>
            <div className="flex flex-col items-center group w-full">
              <div className="w-full max-w-[5rem] bg-indigo-400 rounded-t-md h-32 transition-all group-hover:bg-indigo-500"></div>
              <span className="text-xs text-gray-500 mt-3 font-medium text-center">
                Servidores
              </span>
            </div>
            <div className="flex flex-col items-center group w-full">
              <div className="w-full max-w-[5rem] bg-blue-300 rounded-t-md h-24 transition-all group-hover:bg-blue-400"></div>
              <span className="text-xs text-gray-500 mt-3 font-medium text-center">
                Proyectores
              </span>
            </div>
            <div className="flex flex-col items-center group w-full">
              <div className="w-full max-w-[5rem] bg-indigo-200 rounded-t-md h-16 transition-all group-hover:bg-indigo-300"></div>
              <span className="text-xs text-gray-500 mt-3 font-medium text-center">
                Licencias
              </span>
            </div>
          </div>
        </div>

        {/* Placeholder for Pie Chart / Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Estado de los Activos
          </h3>
          <div className="flex flex-col items-center justify-center h-40">
            {/* Mock Pie Chart (Circle with borders) */}
            <div className="w-32 h-32 rounded-full border-[12px] border-green-500 border-r-blue-500 border-b-purple-500 border-l-orange-400 relative flex items-center justify-center shadow-inner">
              <span className="text-lg font-bold text-gray-700">100%</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>{" "}
                Activos Asignados
              </div>
              <span className="font-semibold text-gray-700">71%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>{" "}
                Activos Disponibles
              </div>
              <span className="font-semibold text-gray-700">25%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span>{" "}
                Activos en Reparación
              </div>
              <span className="font-semibold text-gray-700">3%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>{" "}
                Activos Dados de baja
              </div>
              <span className="font-semibold text-gray-700">1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tables/Lists */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">
            Alertas y Garantías Próximas
          </h3>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            Ver todas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Activo</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Alerta</th>
                <th className="px-6 py-4">Fecha límite</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  Servidor Dell R740 (SRV-005)
                </td>
                <td className="px-6 py-4">Servidor</td>
                <td className="px-6 py-4">Garantía expira</td>
                <td className="px-6 py-4 text-orange-600 font-medium">
                  12 Ago 2024
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    Pendiente
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  Servidor HP ProLiant (SRV-004)
                </td>
                <td className="px-6 py-4">Servidor</td>
                <td className="px-6 py-4">Mantenimiento preventivo</td>
                <td className="px-6 py-4 text-red-600 font-medium">
                  20 Jul 2024
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    Crítico
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  Proyector Epson L200 (PRY-012)
                </td>
                <td className="px-6 py-4">Proyector</td>
                <td className="px-6 py-4">Cambio de lámpara</td>
                <td className="px-6 py-4 text-orange-600 font-medium">
                  01 Sep 2024
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    Pendiente
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  Licencia Adobe CC (Enterprise)
                </td>
                <td className="px-6 py-4">Licencia</td>
                <td className="px-6 py-4">Renovación anual</td>
                <td className="px-6 py-4 text-gray-500">30 Nov 2024</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Programado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

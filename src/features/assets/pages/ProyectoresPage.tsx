// Datos de ejemplo
const proyectores = [
  {
    id: "PROY-001",
    marcaModelo: "Epson PowerLite 1781W",
    laboratorio: "Laboratorio de Redes",
    estado: "Disponible",
  },
  {
    id: "PROY-002",
    marcaModelo: "BenQ MW632ST",
    laboratorio: "Laboratorio de Cómputo Avanzado",
    estado: "En uso",
  },
  {
    id: "PROY-003",
    marcaModelo: "Optoma HD146X",
    laboratorio: "Sala de Juntas A",
    estado: "Reparación",
  },
  {
    id: "PROY-004",
    marcaModelo: "ViewSonic PA503S",
    laboratorio: "Auditorio Principal",
    estado: "Disponible",
  },
];

// Componente para la insignia de estado
const StatusBadge = ({ estado }: { estado: string }) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  let colorClasses = "";

  switch (estado.toLowerCase()) {
    case "disponible":
      colorClasses = "bg-green-100 text-green-800";
      break;
    case "en uso":
      colorClasses = "bg-yellow-100 text-yellow-800";
      break;
    case "reparación":
      colorClasses = "bg-red-100 text-red-800";
      break;
    default:
      colorClasses = "bg-gray-100 text-gray-800";
      break;
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{estado}</span>;
};

export const ProyectoresPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Proyectores</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos los proyectores registrados en el sistema.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Agregar proyector
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Marca y Modelo
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Laboratorio Asignado
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {proyectores.map((proyector) => (
                    <tr key={proyector.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {proyector.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {proyector.marcaModelo}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {proyector.laboratorio}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <StatusBadge estado={proyector.estado} />
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                          <span className="sr-only">
                            , {proyector.marcaModelo}
                          </span>
                        </a>
                        <a
                          href="#"
                          className="ml-4 text-yellow-600 hover:text-yellow-900"
                        >
                          Reportar falla
                          <span className="sr-only">
                            , {proyector.marcaModelo}
                          </span>
                        </a>
                        <a
                          href="#"
                          className="ml-4 text-red-600 hover:text-red-900"
                        >
                          Eliminar
                          <span className="sr-only">
                            , {proyector.marcaModelo}
                          </span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

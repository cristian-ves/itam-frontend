// Datos de ejemplo
const licencias = [
  {
    id: "LIC-001",
    software: "Microsoft Office 2021",
    clave: "XXXXX-XXXXX-XXXXX-XXXXX-12345",
    diasRestantes: 365,
    estado: "Activa",
  },
  {
    id: "LIC-002",
    software: "Adobe Photoshop CC",
    clave: "YYYYY-YYYYY-YYYYY-YYYYY-67890",
    diasRestantes: 25,
    estado: "Activa",
  },
  {
    id: "LIC-003",
    software: "Windows 11 Pro",
    clave: "ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ-11223",
    diasRestantes: 0,
    estado: "Vencida",
  },
  {
    id: "LIC-004",
    software: "AutoCAD 2023",
    clave: "AAAAA-AAAAA-AAAAA-AAAAA-44556",
    diasRestantes: 120,
    estado: "Activa",
  },
];

// Componente para la insignia de estado
const StatusBadge = ({ estado }: { estado: string }) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  let colorClasses = "";

  switch (estado.toLowerCase()) {
    case "activa":
      colorClasses = "bg-green-100 text-green-800";
      break;
    case "vencida":
      colorClasses = "bg-red-100 text-red-800";
      break;
    default:
      colorClasses = "bg-gray-100 text-gray-800";
      break;
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{estado}</span>;
};

// Componente para la celda de Días Restantes
const DiasRestantesCell = ({ dias }: { dias: number }) => {
  if (dias <= 0) {
    return <span className="font-medium text-red-600">0 días</span>;
  }
  if (dias < 30) {
    return <span className="font-bold text-red-600">{dias} días</span>;
  }
  return <span className="text-gray-500">{dias} días</span>;
};

export const LicenciasPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            Licencias de Software
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todas las licencias de software registradas en el sistema.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Agregar licencia
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
                      No.
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Nombre del Software
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Clave del Producto
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Días Restantes
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
                  {licencias.map((lic) => (
                    <tr key={lic.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {lic.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {lic.software}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono">
                        {lic.clave}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <DiasRestantesCell dias={lic.diasRestantes} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <StatusBadge estado={lic.estado} />
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                          <span className="sr-only">, {lic.software}</span>
                        </a>
                        <a
                          href="#"
                          className="ml-4 text-yellow-600 hover:text-yellow-900"
                        >
                          Renovar
                          <span className="sr-only">, {lic.software}</span>
                        </a>
                        <a
                          href="#"
                          className="ml-4 text-red-600 hover:text-red-900"
                        >
                          Eliminar
                          <span className="sr-only">, {lic.software}</span>
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

import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

interface Licencia {
  id: number;
  software: string;
  version: string;
  proveedor: string;
  fecha_vencimiento: string;
  dias_restantes: number;
}

// Componente para la insignia de estado
const StatusBadge = ({ diasRestantes }: { diasRestantes: number }) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  let colorClasses = "";
  let estadoText = "";

  if (diasRestantes > 0) {
    colorClasses = "bg-green-100 text-green-800";
    estadoText = "Activa";
  } else {
    colorClasses = "bg-red-100 text-red-800";
    estadoText = "Vencida";
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{estadoText}</span>;
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
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicencias = async () => {
      try {
        const response = await api.get("/licencia");
        setLicencias(response.data);
      } catch (error) {
        console.error("Error fetching licencias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLicencias();
  }, []);

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
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Software
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Proveedor
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Fecha Vencimiento
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
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-4 text-center text-sm text-gray-500"
                      >
                        Cargando licencias...
                      </td>
                    </tr>
                  ) : licencias.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-4 text-center text-sm text-gray-500"
                      >
                        No hay licencias registradas.
                      </td>
                    </tr>
                  ) : (
                    licencias.map((lic) => (
                      <tr key={lic.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {lic.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {lic.software} {lic.version}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {lic.proveedor}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(lic.fecha_vencimiento).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <DiasRestantesCell dias={lic.dias_restantes} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <StatusBadge diasRestantes={lic.dias_restantes} />
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

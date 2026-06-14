import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

interface Laboratorio {
  id: number;
  nombre_lab: string;
  edificio_salon: string;
  capacidad: number;
  estado: string;
}

// Componente para la insignia de estado
const StatusBadge = ({ estado }: { estado: string }) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  let colorClasses = "";

  switch (estado.toLowerCase()) {
    case "activo":
      colorClasses = "bg-green-100 text-green-800";
      break;
    case "inactivo":
      colorClasses = "bg-red-100 text-red-800";
      break;
    default:
      colorClasses = "bg-yellow-100 text-yellow-800";
      break;
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{estado}</span>;
};

export const LaboratoriosPage = () => {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const response = await api.get("/dashboard/laboratorios");
        setLaboratorios(response.data);
      } catch (error) {
        console.error("Error fetching laboratorios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaboratorios();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Laboratorios</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos los laboratorios registrados en el sistema.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Agregar laboratorio
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
                      Nombre Laboratorio
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Edificio/Salón
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Capacidad
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
                        colSpan={6}
                        className="py-4 text-center text-sm text-gray-500"
                      >
                        Cargando laboratorios...
                      </td>
                    </tr>
                  ) : laboratorios.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-sm text-gray-500"
                      >
                        No hay laboratorios registrados.
                      </td>
                    </tr>
                  ) : (
                    laboratorios.map((lab) => (
                      <tr key={lab.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {lab.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {lab.nombre_lab}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {lab.edificio_salon}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {lab.capacidad}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <StatusBadge estado={lab.estado} />
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                            <span className="sr-only">, {lab.nombre_lab}</span>
                          </a>
                          <a
                            href="#"
                            className="ml-4 text-gray-600 hover:text-gray-900"
                          >
                            Detalles
                            <span className="sr-only">, {lab.nombre_lab}</span>
                          </a>
                          <a
                            href="#"
                            className="ml-4 text-red-600 hover:text-red-900"
                          >
                            Eliminar
                            <span className="sr-only">, {lab.nombre_lab}</span>
                          </a>
                        </td>
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

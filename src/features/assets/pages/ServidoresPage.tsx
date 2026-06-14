import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

interface Servidor {
  id: number;
  nombre: string;
  direccion_ip: string;
  sistema_operativo: string;
  estado: string;
  ultimo_mantenimiento_fecha: string | null;
}

// Componente para la insignia de estado
const StatusBadge = ({ estado }: { estado: string }) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  let colorClasses = "";

  switch (estado.toLowerCase()) {
    case "disponible":
    case "encendido":
      colorClasses = "bg-green-100 text-green-800";
      break;
    case "asignado":
      colorClasses = "bg-blue-100 text-blue-800";
      break;
    case "en mantenimiento":
      colorClasses = "bg-yellow-100 text-yellow-800";
      break;
    case "apagado":
      colorClasses = "bg-gray-100 text-gray-800";
      break;
    case "fallo":
      colorClasses = "bg-red-100 text-red-800";
      break;
    default:
      colorClasses = "bg-yellow-100 text-yellow-800";
      break;
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{estado}</span>;
};

export const ServidoresPage = () => {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServidores = async () => {
      try {
        const response = await api.get("/dashboard/servidores");
        setServidores(response.data);
      } catch (error) {
        console.error("Error fetching servidores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServidores();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Servidores</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos los servidores registrados en el sistema.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Agregar servidor
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
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Dirección IP
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Sistema Operativo
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Último Mantenimiento
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
                        Cargando servidores...
                      </td>
                    </tr>
                  ) : servidores.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-4 text-center text-sm text-gray-500"
                      >
                        No hay servidores registrados.
                      </td>
                    </tr>
                  ) : (
                    servidores.map((server) => (
                      <tr key={server.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {server.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {server.nombre}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {server.direccion_ip}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {server.sistema_operativo}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {server.ultimo_mantenimiento_fecha
                            ? new Date(
                                server.ultimo_mantenimiento_fecha,
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <StatusBadge estado={server.estado} />
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                            <span className="sr-only">, {server.nombre}</span>
                          </a>
                          <a
                            href="#"
                            className="ml-4 text-red-600 hover:text-red-900"
                          >
                            Eliminar
                            <span className="sr-only">, {server.nombre}</span>
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

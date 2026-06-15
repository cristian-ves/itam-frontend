import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditActivoModal } from "../components/EditActivoModal";
import { DetallesActivoModal } from "../components/DetallesActivoModal";

// Ajusta esta interfaz según la estructura real de los datos que devuelve tu backend
interface Activo {
  id: string | number;
  nombre: string;
  estado?: string;
}

export const ActivosListadoPage = () => {
  const [activos, setActivos] = useState<Activo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivoId, setSelectedActivoId] = useState<
    string | number | null
  >(null);

  // States for Details Modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsActivoId, setDetailsActivoId] = useState<
    string | number | null
  >(null);

  const navigate = useNavigate();

  const fetchActivos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/activos");
      if (!response.ok) {
        throw new Error("Error al obtener los activos");
      }
      const data = await response.json();
      setActivos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivos();
  }, []);

  const handleEditClick = (id: string | number) => {
    setSelectedActivoId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedActivoId(null);
  };

  const handleDetailsClick = (id: string | number) => {
    setDetailsActivoId(id);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setDetailsActivoId(null);
  };

  const handleSaveSuccess = () => {
    fetchActivos();
  };

  const handleDeleteClick = async (id: string | number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este activo físicamente del inventario? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/activos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el activo");
      }

      fetchActivos();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al eliminar el activo.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Todos los Activos
      </h2>

      {loading && <p className="text-gray-600">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-4 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-sm font-semibold text-gray-900"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {activos.map((activo) => (
                <tr
                  key={activo.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {activo.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {activo.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {activo.estado || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-green-600 hover:text-green-900 mr-4"
                      onClick={() => handleDetailsClick(activo.id)}
                    >
                      Ver detalles
                    </button>
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      onClick={() => handleEditClick(activo.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteClick(activo.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditActivoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        activoId={selectedActivoId}
        onSaveSuccess={handleSaveSuccess}
      />

      <DetallesActivoModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        activoId={detailsActivoId}
      />
    </div>
  );
};

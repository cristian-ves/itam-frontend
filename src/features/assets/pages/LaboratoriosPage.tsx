import { useCallback, useEffect, useState } from "react";
import api from "../../../shared/services/api";
import { AddLaboratorioModal } from "../components/AddLaboratorioModal"; // Importa el nuevo componente modal
import { DetallesLaboratorioModal } from "../components/DetallesLaboratorioModal";
import { EditLaboratorioModal } from "../components/EditLaboratorioModal.tsx";
import { toast } from "sonner";

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
  let colorClasses;

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [selectedEditLabId, setSelectedEditLabId] = useState<number | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [labToDelete, setLabToDelete] = useState<Laboratorio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLaboratorios = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/dashboard/laboratorios");
      setLaboratorios(response.data);
    } catch (err) {
      console.error("Error fetching laboratorios:", err);
      setError(
        "No se pudieron cargar los laboratorios. Por favor, inténtalo de nuevo más tarde.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadLaboratorios = async () => {
      setLoading(true);

      try {
        const response = await api.get("/dashboard/laboratorios");
        setLaboratorios(response.data);
      } catch (err) {
        console.error("Error fetching laboratorios:", err);
        setError(
          "No se pudieron cargar los laboratorios. Por favor, inténtalo de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadLaboratorios();
  }, [fetchLaboratorios]);

  const handleAddLaboratorioClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDetallesClick = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedLabId(id);
    setIsDetallesModalOpen(true);
  };

  const handleEditClick = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedEditLabId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseDetallesModal = () => {
    setIsDetallesModalOpen(false);
    setSelectedLabId(null);
  };

  const handleDeleteClick = (lab: Laboratorio, e: React.MouseEvent) => {
    e.preventDefault();
    setLabToDelete(lab);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setLabToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!labToDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/ubicacion/${labToDelete.id}`);
      setLaboratorios((currentLaboratorios) =>
        currentLaboratorios.filter((lab) => lab.id !== labToDelete.id),
      );
      toast.success(
        `Laboratorio "${labToDelete.nombre_lab}" eliminado correctamente`,
      );
      setIsDeleteModalOpen(false);
      setLabToDelete(null);
    } catch (err) {
      console.error("Error al eliminar laboratorio:", err);
      toast.error("No se pudo eliminar el laboratorio. Intenta nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLaboratorioAdded = () => {
    void fetchLaboratorios();
  };

  const handleLaboratorioEdited = () => {
    void fetchLaboratorios();
  };

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
            onClick={handleAddLaboratorioClick} // Asigna el manejador de clic
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
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-sm text-red-600"
                      >
                        {error}
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
                          <button
                            type="button"
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => handleEditClick(lab.id, e)}
                          >
                            Editar
                            <span className="sr-only">, {lab.nombre_lab}</span>
                          </button>
                          <a
                            href="#"
                            className="ml-4 text-gray-600 hover:text-gray-900"
                            onClick={(e) => handleDetallesClick(lab.id, e)}
                          >
                            Detalles
                            <span className="sr-only">, {lab.nombre_lab}</span>
                          </a>
                          <button
                            type="button"
                            className="ml-4 inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 hover:text-red-800"
                            onClick={(e) => handleDeleteClick(lab, e)}
                          >
                            Eliminar
                            <span className="sr-only">, {lab.nombre_lab}</span>
                          </button>
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
      <AddLaboratorioModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddSuccess={handleLaboratorioAdded}
      />
      <DetallesLaboratorioModal
        isOpen={isDetallesModalOpen}
        onClose={handleCloseDetallesModal}
        laboratorioId={selectedLabId}
      />
      <EditLaboratorioModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditLabId(null);
        }}
        laboratorioId={selectedEditLabId}
        onSaveSuccess={handleLaboratorioEdited}
      />
      {isDeleteModalOpen && labToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={handleCloseDeleteModal}
          ></div>
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-100 bg-white shadow-2xl shadow-slate-950/20">
            <div className="border-b border-red-100 bg-red-50 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                Confirmar eliminación
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Eliminar laboratorio
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Estás por eliminar{" "}
                <span className="font-semibold text-slate-900">
                  {labToDelete.nombre_lab}
                </span>
                . Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/70 px-4 py-4 text-sm text-red-700">
                Si continúas, el laboratorio se eliminará permanentemente del
                sistema.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar laboratorio"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

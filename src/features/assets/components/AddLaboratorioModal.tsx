import { useState } from "react";
import { toast } from "sonner";
import api from "../../../shared/services/api";

interface AddLaboratorioForm {
  nombre: string;
  edificio: string;
  piso: string;
  capacidad: number | ""; // Permite cadena vacía para el estado inicial del input numérico
  estado: string;
}

interface AddLaboratorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void; // Callback para refrescar la lista de laboratorios
}

export const AddLaboratorioModal = ({
  isOpen,
  onClose,
  onAddSuccess,
}: AddLaboratorioModalProps) => {
  const [formData, setFormData] = useState<AddLaboratorioForm>({
    nombre: "",
    edificio: "",
    piso: "",
    capacidad: "",
    estado: "Activo", // Estado por defecto
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacidad" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación básica
    if (
      !formData.nombre ||
      !formData.edificio ||
      !formData.piso ||
      formData.capacidad === "" ||
      Number(formData.capacidad) <= 0 ||
      !formData.estado
    ) {
      toast.error("Por favor, completa todos los campos correctamente.");
      setIsSubmitting(false);
      return;
    }

    try {
      // El endpoint de creación espera 'nombre', 'edificio', 'piso', 'capacidad', 'estado'
      await api.post("/ubicacion", formData);
      toast.success("Laboratorio agregado exitosamente");
      onAddSuccess(); // Notifica al componente padre para refrescar la lista
      onClose(); // Cierra el modal
      // Resetea el formulario
      setFormData({
        nombre: "",
        edificio: "",
        piso: "",
        capacidad: "",
        estado: "Activo",
      });
    } catch (err) {
      console.error("Error al crear laboratorio:", err);
      toast.error(
        "Error al crear el laboratorio. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative mx-auto my-6 w-auto max-w-lg">
        {/* Contenido del Modal */}
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
          {/* Encabezado del Modal */}
          <div className="flex items-start justify-between rounded-t border-b border-solid border-gray-200 p-5">
            <h3 className="text-xl font-semibold text-gray-900">
              Agregar Nuevo Laboratorio
            </h3>
            <button
              className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-gray-900 opacity-50 outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="block h-6 w-6 bg-transparent text-2xl text-gray-900 opacity-50 outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          {/* Cuerpo del Modal */}
          <div className="relative flex-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre del Laboratorio
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="edificio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Edificio
                </label>
                <input
                  type="text"
                  name="edificio"
                  id="edificio"
                  value={formData.edificio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="piso"
                  className="block text-sm font-medium text-gray-700"
                >
                  Piso
                </label>
                <input
                  type="text"
                  name="piso"
                  id="piso"
                  value={formData.piso}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="capacidad"
                  className="block text-sm font-medium text-gray-700"
                >
                  Capacidad
                </label>
                <input
                  type="number"
                  name="capacidad"
                  id="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="estado"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>
              <div className="flex items-center justify-end rounded-b border-t border-solid border-gray-200 p-6">
                <button
                  type="button"
                  className="mr-1 rounded px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-150 ease-linear hover:bg-gray-100"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Laboratorio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../shared/services/api";

interface LaboratorioEditable {
  nombre?: string;
  nombre_lab?: string;
  edificio?: string;
  edificio_salon?: string;
  piso?: string;
  capacidad?: number;
  estado?: string;
}

interface EditLaboratorioForm {
  nombre: string;
  edificio: string;
  piso: string;
  capacidad: number | "";
  estado: string;
}

interface EditLaboratorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  laboratorioId: number | null;
  onSaveSuccess: () => void;
}

const estadoOptions = ["Activo", "Inactivo", "Disponible", "Mantenimiento"];

export const EditLaboratorioModal = ({
  isOpen,
  onClose,
  laboratorioId,
  onSaveSuccess,
}: EditLaboratorioModalProps) => {
  const [formData, setFormData] = useState<EditLaboratorioForm>({
    nombre: "",
    edificio: "",
    piso: "",
    capacidad: "",
    estado: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || laboratorioId === null) {
      return;
    }

    const fetchLaboratorio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<LaboratorioEditable>(
          `/ubicacion/${laboratorioId}`,
        );
        const laboratorio = response.data;

        setFormData({
          nombre: laboratorio.nombre ?? "",
          edificio: laboratorio.edificio ?? "",
          piso: laboratorio.piso ?? "",
          capacidad: laboratorio.capacidad ?? "",
          estado: laboratorio.estado ?? "",
        });
      } catch (err) {
        console.error("Error al obtener el laboratorio para editar:", err);
        setError("No se pudo cargar la información del laboratorio.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaboratorio();
  }, [isOpen, laboratorioId]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

    if (laboratorioId === null) {
      toast.error("No se pudo identificar el laboratorio a editar.");
      return;
    }

    if (
      !formData.nombre ||
      !formData.edificio ||
      !formData.piso ||
      formData.capacidad === "" ||
      Number(formData.capacidad) <= 0 ||
      !formData.estado
    ) {
      toast.error("Por favor, completa todos los campos correctamente.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.patch(`/ubicacion/${laboratorioId}`, {
        nombre: formData.nombre,
        edificio: formData.edificio,
        piso: formData.piso,
        capacidad: Number(formData.capacidad),
        estado: formData.estado,
      });
      toast.success("Laboratorio actualizado correctamente");
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Error al actualizar laboratorio:", err);
      toast.error("No se pudo actualizar el laboratorio. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedEstadoOptions = estadoOptions.includes(formData.estado)
    ? estadoOptions
    : formData.estado
      ? [formData.estado, ...estadoOptions]
      : estadoOptions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-6 outline-none focus:outline-none sm:px-6 lg:px-8">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative mx-auto my-6 w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200/80 outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 bg-slate-50/80 px-6 py-5 sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Ubicación
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Editar Laboratorio
              </h3>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Actualiza los datos del laboratorio seleccionado.
              </p>
            </div>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          <div className="relative flex-auto px-6 py-6 sm:px-8">
            {isLoading ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"></div>
                  <span className="text-sm font-medium">
                    Cargando datos del laboratorio...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                {error}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Nombre del laboratorio
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="edificio"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Edificio
                  </label>
                  <input
                    type="text"
                    name="edificio"
                    id="edificio"
                    value={formData.edificio}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="piso"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Piso
                  </label>
                  <input
                    type="text"
                    name="piso"
                    id="piso"
                    value={formData.piso}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="capacidad"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Capacidad
                  </label>
                  <input
                    type="number"
                    name="capacidad"
                    id="capacidad"
                    min="1"
                    value={formData.capacidad}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="estado"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  >
                    <option value="" disabled>
                      Selecciona un estado
                    </option>
                    {displayedEstadoOptions.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

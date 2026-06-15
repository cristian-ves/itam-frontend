import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../shared/services/api";

interface LicenciaEditable {
  software?: string;
  version?: string;
  proveedor?: string;
  cantidad_licencias?: number | "";
  tipo_licencia?: string;
  fecha_adquisicion?: string;
  fecha_vencimiento?: string;
  costo?: number | "";
  notas?: string;
  clave_producto?: string;
}

interface EditLicenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenciaId: number | null;
  onSaveSuccess: () => void;
}

const tipoLicenciaOptions = ["Anual", "Permanente", "Suscripción"];

export const EditLicenciaModal = ({
  isOpen,
  onClose,
  licenciaId,
  onSaveSuccess,
}: EditLicenciaModalProps) => {
  const [formData, setFormData] = useState<LicenciaEditable>({
    software: "",
    version: "",
    proveedor: "",
    cantidad_licencias: "",
    tipo_licencia: "",
    fecha_adquisicion: "",
    fecha_vencimiento: "",
    costo: "",
    notas: "",
    clave_producto: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || licenciaId === null) {
      return;
    }

    const fetchLicencia = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/licencia/${licenciaId}`);
        const licencia = response.data;

        const formatDate = (dateString?: string | null) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
        };

        setFormData({
          software: licencia.software ?? "",
          version: licencia.version ?? "",
          proveedor: licencia.proveedor ?? "",
          cantidad_licencias: licencia.cantidad_licencias ?? "",
          tipo_licencia: licencia.tipo_licencia ?? "",
          fecha_adquisicion: formatDate(licencia.fecha_adquisicion),
          fecha_vencimiento: formatDate(licencia.fecha_vencimiento),
          costo: licencia.costo ?? "",
          notas: licencia.notas ?? "",
          clave_producto: licencia.clave_producto ?? "",
        });
      } catch (err) {
        console.error("Error al obtener la licencia para editar:", err);
        setError("No se pudo cargar la información de la licencia.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLicencia();
  }, [isOpen, licenciaId]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (licenciaId === null) {
      toast.error("No se pudo identificar la licencia a editar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<LicenciaEditable> = { ...formData };
      
      // Clean up number fields
      if (payload.cantidad_licencias === "") delete payload.cantidad_licencias;
      else payload.cantidad_licencias = Number(payload.cantidad_licencias);
      
      if (payload.costo === "") delete payload.costo;
      else payload.costo = Number(payload.costo);

      await api.patch(`/licencia/${licenciaId}`, payload);
      toast.success("Licencia actualizada correctamente");
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Error al actualizar licencia:", err);
      toast.error("No se pudo actualizar la licencia. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedTipoLicenciaOptions = tipoLicenciaOptions.includes(formData.tipo_licencia || "")
    ? tipoLicenciaOptions
    : formData.tipo_licencia
      ? [formData.tipo_licencia, ...tipoLicenciaOptions]
      : tipoLicenciaOptions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-6 outline-none focus:outline-none sm:px-6 lg:px-8">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative mx-auto my-6 w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200/80 outline-none flex flex-col max-h-[90vh]">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 bg-slate-50/80 px-6 py-5 sm:px-8 shrink-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Licencias
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Editar Licencia
              </h3>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Actualiza los detalles de la licencia de software.
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

          <div className="relative flex-auto px-6 py-6 sm:px-8 overflow-y-auto">
            {isLoading ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"></div>
                  <span className="text-sm font-medium">
                    Cargando datos de la licencia...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                {error}
              </div>
            ) : (
              <form
                id="edit-licencia-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <div>
                  <label htmlFor="software" className="block text-sm font-medium text-slate-700">Software</label>
                  <input type="text" name="software" id="software" value={formData.software} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label htmlFor="version" className="block text-sm font-medium text-slate-700">Versión</label>
                  <input type="text" name="version" id="version" value={formData.version} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label htmlFor="proveedor" className="block text-sm font-medium text-slate-700">Proveedor</label>
                  <input type="text" name="proveedor" id="proveedor" value={formData.proveedor} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label htmlFor="clave_producto" className="block text-sm font-medium text-slate-700">Clave de Producto</label>
                  <input type="text" name="clave_producto" id="clave_producto" value={formData.clave_producto} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label htmlFor="cantidad_licencias" className="block text-sm font-medium text-slate-700">Cantidad de Licencias</label>
                  <input type="number" name="cantidad_licencias" id="cantidad_licencias" min="0" value={formData.cantidad_licencias} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label htmlFor="tipo_licencia" className="block text-sm font-medium text-slate-700">Tipo de Licencia</label>
                  <select id="tipo_licencia" name="tipo_licencia" value={formData.tipo_licencia} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Selecciona un tipo</option>
                    {displayedTipoLicenciaOptions.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="fecha_adquisicion" className="block text-sm font-medium text-slate-700">Fecha de Adquisición</label>
                  <input type="date" name="fecha_adquisicion" id="fecha_adquisicion" value={formData.fecha_adquisicion} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-slate-700">Fecha de Vencimiento</label>
                  <input type="date" name="fecha_vencimiento" id="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label htmlFor="costo" className="block text-sm font-medium text-slate-700">Costo</label>
                  <input type="number" step="0.01" min="0" name="costo" id="costo" value={formData.costo} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="notas" className="block text-sm font-medium text-slate-700">Notas</label>
                  <textarea name="notas" id="notas" rows={2} value={formData.notas} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </form>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-200/80 bg-slate-50/80 px-6 py-5 sm:px-8 shrink-0">
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
              form="edit-licencia-form"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

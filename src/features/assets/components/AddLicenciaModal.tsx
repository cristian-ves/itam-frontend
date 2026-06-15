import { useState } from "react";
import { toast } from "sonner";
import api from "../../../shared/services/api";

interface LicenciaForm {
  software: string;
  version: string;
  proveedor: string;
  cantidad_licencias: number | "";
  tipo_licencia: string;
  fecha_adquisicion: string;
  fecha_vencimiento: string;
  costo: number | "";
  notas: string;
  clave_producto: string;
}

interface AddLicenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const tipoLicenciaOptions = ["Anual", "Permanente", "Suscripción"];

export const AddLicenciaModal = ({
  isOpen,
  onClose,
  onSaveSuccess,
}: AddLicenciaModalProps) => {
  const [formData, setFormData] = useState<LicenciaForm>({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.software ||
      !formData.version ||
      !formData.proveedor ||
      formData.cantidad_licencias === "" ||
      !formData.tipo_licencia ||
      !formData.fecha_adquisicion ||
      !formData.fecha_vencimiento ||
      formData.costo === "" ||
      !formData.notas ||
      !formData.clave_producto
    ) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        cantidad_licencias: Number(formData.cantidad_licencias),
        costo: Number(formData.costo),
      };

      await api.post("/licencia", payload);
      toast.success("Licencia creada correctamente");
      onSaveSuccess();
      onClose();
      setFormData({
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
    } catch (err) {
      console.error("Error al crear licencia:", err);
      toast.error("No se pudo crear la licencia. Verifica los datos e intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Agregar Nueva Licencia
              </h3>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Registra una nueva licencia de software en el sistema completando los siguientes datos.
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
            <form id="add-licencia-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="software" className="block text-sm font-medium text-slate-700">Software *</label>
                <input type="text" name="software" id="software" value={formData.software} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-slate-700">Versión *</label>
                <input type="text" name="version" id="version" value={formData.version} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="proveedor" className="block text-sm font-medium text-slate-700">Proveedor *</label>
                <input type="text" name="proveedor" id="proveedor" value={formData.proveedor} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="clave_producto" className="block text-sm font-medium text-slate-700">Clave de Producto *</label>
                <input type="text" name="clave_producto" id="clave_producto" value={formData.clave_producto} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="cantidad_licencias" className="block text-sm font-medium text-slate-700">Cantidad de Licencias *</label>
                <input type="number" name="cantidad_licencias" id="cantidad_licencias" min="0" value={formData.cantidad_licencias} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="tipo_licencia" className="block text-sm font-medium text-slate-700">Tipo de Licencia *</label>
                <select id="tipo_licencia" name="tipo_licencia" value={formData.tipo_licencia} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                  <option value="" disabled>Selecciona un tipo</option>
                  {tipoLicenciaOptions.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="fecha_adquisicion" className="block text-sm font-medium text-slate-700">Fecha de Adquisición *</label>
                <input type="date" name="fecha_adquisicion" id="fecha_adquisicion" value={formData.fecha_adquisicion} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-slate-700">Fecha de Vencimiento *</label>
                <input type="date" name="fecha_vencimiento" id="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="costo" className="block text-sm font-medium text-slate-700">Costo *</label>
                <input type="number" step="0.01" min="0" name="costo" id="costo" value={formData.costo} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notas" className="block text-sm font-medium text-slate-700">Notas *</label>
                <textarea name="notas" id="notas" rows={2} value={formData.notas} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </form>
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
              form="add-licencia-form"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Crear Licencia"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

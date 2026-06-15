import { useState } from "react";
import { toast } from "sonner";
import api from "../../../shared/services/api";

interface ActivoForm {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria_id: number | "";
  marca: string;
  modelo: string;
  numero_serie: string;
  estado: string;
  ubicacion_id: number | "";
  fecha_compra: string;
  fecha_registro: string;
  valor_compra: number | "";
  direccion_ip: string;
  sistema_operativo: string;
}

interface AddActivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const estadoOptions = ["Disponible", "Asignado", "En Mantenimiento", "Baja"];

export const AddActivoModal = ({
  isOpen,
  onClose,
  onSaveSuccess,
}: AddActivoModalProps) => {
  const [formData, setFormData] = useState<ActivoForm>({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria_id: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    estado: "",
    ubicacion_id: "",
    fecha_compra: "",
    fecha_registro: new Date().toISOString().split("T")[0], // Default a hoy
    valor_compra: "",
    direccion_ip: "",
    sistema_operativo: "",
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

    // Basic validation (can be expanded)
    if (
      !formData.codigo ||
      !formData.nombre ||
      !formData.descripcion ||
      formData.categoria_id === "" ||
      !formData.marca ||
      !formData.modelo ||
      !formData.numero_serie ||
      !formData.estado ||
      formData.ubicacion_id === "" ||
      !formData.fecha_compra ||
      !formData.fecha_registro ||
      formData.valor_compra === "" ||
      !formData.direccion_ip ||
      !formData.sistema_operativo
    ) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        categoria_id: Number(formData.categoria_id),
        ubicacion_id: Number(formData.ubicacion_id),
        valor_compra: Number(formData.valor_compra),
        // Convirtiendo a formato de fecha que espera el backend (probablemente ISO)
        // Aunque el body especifica YYYY-MM-DD
      };

      // Si el backend es estricto y solo acepta ISO string para fechas:
      // payload.fecha_compra = new Date(payload.fecha_compra).toISOString();
      // payload.fecha_registro = new Date(payload.fecha_registro).toISOString();

      await api.post("/activos", payload);
      toast.success("Activo creado correctamente");
      onSaveSuccess();
      onClose();
      // Limpiar el form
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        categoria_id: "",
        marca: "",
        modelo: "",
        numero_serie: "",
        estado: "",
        ubicacion_id: "",
        fecha_compra: "",
        fecha_registro: new Date().toISOString().split("T")[0],
        valor_compra: "",
        direccion_ip: "",
        sistema_operativo: "",
      });
    } catch (err) {
      console.error("Error al crear activo:", err);
      toast.error("No se pudo crear el activo. Verifica los datos e intenta nuevamente.");
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
                Activos
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Agregar Nuevo Activo
              </h3>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Registra un nuevo activo en el sistema completando los siguientes datos.
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
            <form id="add-activo-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-slate-700">Código *</label>
                <input type="text" name="codigo" id="codigo" value={formData.codigo} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-slate-700">Nombre *</label>
                <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700">Descripción *</label>
                <textarea name="descripcion" id="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="categoria_id" className="block text-sm font-medium text-slate-700">ID Categoría *</label>
                <input type="number" name="categoria_id" id="categoria_id" value={formData.categoria_id} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="ubicacion_id" className="block text-sm font-medium text-slate-700">ID Ubicación *</label>
                <input type="number" name="ubicacion_id" id="ubicacion_id" value={formData.ubicacion_id} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-slate-700">Marca *</label>
                <input type="text" name="marca" id="marca" value={formData.marca} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="modelo" className="block text-sm font-medium text-slate-700">Modelo *</label>
                <input type="text" name="modelo" id="modelo" value={formData.modelo} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="numero_serie" className="block text-sm font-medium text-slate-700">Número de Serie *</label>
                <input type="text" name="numero_serie" id="numero_serie" value={formData.numero_serie} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-slate-700">Estado *</label>
                <select id="estado" name="estado" value={formData.estado} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                  <option value="" disabled>Selecciona un estado</option>
                  {estadoOptions.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="direccion_ip" className="block text-sm font-medium text-slate-700">Dirección IP *</label>
                <input type="text" name="direccion_ip" id="direccion_ip" placeholder="ej: 192.168.1.1" value={formData.direccion_ip} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="sistema_operativo" className="block text-sm font-medium text-slate-700">Sistema Operativo *</label>
                <input type="text" name="sistema_operativo" id="sistema_operativo" placeholder="ej: Windows 11" value={formData.sistema_operativo} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="fecha_compra" className="block text-sm font-medium text-slate-700">Fecha de Compra *</label>
                <input type="date" name="fecha_compra" id="fecha_compra" value={formData.fecha_compra} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="fecha_registro" className="block text-sm font-medium text-slate-700">Fecha de Registro *</label>
                <input type="date" name="fecha_registro" id="fecha_registro" value={formData.fecha_registro} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label htmlFor="valor_compra" className="block text-sm font-medium text-slate-700">Valor de Compra *</label>
                <input type="number" step="0.01" min="0" name="valor_compra" id="valor_compra" value={formData.valor_compra} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
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
              form="add-activo-form"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Crear Activo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
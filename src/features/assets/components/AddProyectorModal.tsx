import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import api from "../../../shared/services/api";

interface LaboratorioOption {
  id: number;
  nombre_lab?: string;
  nombre?: string;
  edificio_salon?: string;
}

interface ProyectorForm {
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

interface AddProyectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}

const DEFAULT_CATEGORIA_ID = 5;

const toDatetimeLocalValue = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
};

const createDefaultForm = (): ProyectorForm => {
  const now = toDatetimeLocalValue(new Date());

  return {
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria_id: DEFAULT_CATEGORIA_ID,
    marca: "",
    modelo: "",
    numero_serie: "",
    estado: "Disponible",
    ubicacion_id: "",
    fecha_compra: now,
    fecha_registro: now,
    valor_compra: "",
    direccion_ip: "",
    sistema_operativo: "N/A",
  };
};

const estadoOptions = [
  "Disponible",
  "Asignado",
  "En uso",
  "En mantenimiento",
  "Reparación",
  "Fallo",
];

export const AddProyectorModal = ({
  isOpen,
  onClose,
  onAddSuccess,
}: AddProyectorModalProps) => {
  const [formData, setFormData] = useState<ProyectorForm>(createDefaultForm);
  const [laboratorios, setLaboratorios] = useState<LaboratorioOption[]>([]);
  const [isLoadingLaboratorios, setIsLoadingLaboratorios] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(createDefaultForm());

    const fetchLaboratorios = async () => {
      setIsLoadingLaboratorios(true);

      try {
        const response = await api.get("/ubicacion");
        const laboratoriosData = response.data?.data ?? response.data ?? [];
        setLaboratorios(
          Array.isArray(laboratoriosData) ? laboratoriosData : [],
        );
      } catch (error) {
        console.error("Error al cargar laboratorios:", error);
        toast.error("No se pudieron cargar los laboratorios disponibles.");
      } finally {
        setIsLoadingLaboratorios(false);
      }
    };

    void fetchLaboratorios();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    const numericFields = new Set([
      "categoria_id",
      "ubicacion_id",
      "valor_compra",
    ]);

    setFormData((current) => ({
      ...current,
      [name]: numericFields.has(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (
      !formData.codigo ||
      !formData.nombre ||
      !formData.marca ||
      !formData.modelo ||
      !formData.numero_serie ||
      !formData.estado ||
      formData.categoria_id === "" ||
      formData.ubicacion_id === "" ||
      formData.valor_compra === "" ||
      !formData.fecha_compra ||
      !formData.fecha_registro ||
      !formData.direccion_ip ||
      !formData.sistema_operativo
    ) {
      toast.error(
        "Completa los campos obligatorios para registrar el proyector.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/activos", {
        codigo: formData.codigo,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria_id: Number(formData.categoria_id),
        marca: formData.marca,
        modelo: formData.modelo,
        numero_serie: formData.numero_serie,
        estado: formData.estado,
        ubicacion_id: Number(formData.ubicacion_id),
        fecha_compra: new Date(formData.fecha_compra).toISOString(),
        fecha_registro: new Date(formData.fecha_registro).toISOString(),
        valor_compra: Number(formData.valor_compra),
        direccion_ip: formData.direccion_ip,
        sistema_operativo: formData.sistema_operativo,
      });

      toast.success("Proyector agregado correctamente");
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear proyector:", error);
      toast.error("No se pudo registrar el proyector. Intenta nuevamente.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 outline-none focus:outline-none sm:px-6 lg:px-8">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative mx-auto w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200/80 outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 bg-slate-50/80 px-6 py-5 sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Activos
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Agregar Proyector
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Registra un nuevo proyector enviando el body esperado por el
                endpoint de activos.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          <div className="relative px-6 py-6 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="codigo"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Código
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    id="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Nombre
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

                <div className="md:col-span-2">
                  <label
                    htmlFor="descripcion"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    id="descripcion"
                    rows={3}
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="categoria_id"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Categoría ID
                  </label>
                  <input
                    type="number"
                    name="categoria_id"
                    id="categoria_id"
                    min="1"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="ubicacion_id"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Laboratorio / Ubicación
                  </label>
                  <select
                    id="ubicacion_id"
                    name="ubicacion_id"
                    value={formData.ubicacion_id}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                    disabled={isLoadingLaboratorios}
                  >
                    <option value="">
                      {isLoadingLaboratorios
                        ? "Cargando laboratorios..."
                        : "Selecciona una ubicación"}
                    </option>
                    {laboratorios.map((laboratorio) => (
                      <option key={laboratorio.id} value={laboratorio.id}>
                        {laboratorio.nombre_lab ??
                          laboratorio.nombre ??
                          `Ubicación ${laboratorio.id}`}
                        {laboratorio.edificio_salon
                          ? ` - ${laboratorio.edificio_salon}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="marca"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Marca
                  </label>
                  <input
                    type="text"
                    name="marca"
                    id="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="modelo"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Modelo
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    id="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="numero_serie"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Número de serie
                  </label>
                  <input
                    type="text"
                    name="numero_serie"
                    id="numero_serie"
                    value={formData.numero_serie}
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
                    {displayedEstadoOptions.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fecha_compra"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Fecha de compra
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_compra"
                    id="fecha_compra"
                    value={formData.fecha_compra}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="fecha_registro"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Fecha de registro
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_registro"
                    id="fecha_registro"
                    value={formData.fecha_registro}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="valor_compra"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Valor de compra
                  </label>
                  <input
                    type="number"
                    name="valor_compra"
                    id="valor_compra"
                    min="0"
                    step="0.01"
                    value={formData.valor_compra}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="direccion_ip"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Dirección IP
                  </label>
                  <input
                    type="text"
                    name="direccion_ip"
                    id="direccion_ip"
                    value={formData.direccion_ip}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="sistema_operativo"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Sistema operativo
                  </label>
                  <input
                    type="text"
                    name="sistema_operativo"
                    id="sistema_operativo"
                    value={formData.sistema_operativo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
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
                  disabled={isSubmitting || isLoadingLaboratorios}
                >
                  {isSubmitting ? "Guardando..." : "Guardar proyector"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

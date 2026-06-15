import { useEffect, useState } from "react";
import api from "../../../shared/services/api";

interface ActivoDetalle {
  id?: number | string;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  categoria_id?: number;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  estado?: string;
  ubicacion_id?: number;
  fecha_compra?: string;
  fecha_registro?: string;
  valor_compra?: number;
  direccion_ip?: string;
  sistema_operativo?: string;
}

interface DetallesActivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activoId: string | number | null;
}

export const DetallesActivoModal = ({
  isOpen,
  onClose,
  activoId,
}: DetallesActivoModalProps) => {
  const [activo, setActivo] = useState<ActivoDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || activoId === null) {
      return;
    }

    const fetchActivo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<ActivoDetalle>(`/activos/${activoId}`);
        setActivo(response.data);
      } catch (err) {
        console.error("Error al obtener los detalles del activo:", err);
        setError("No se pudo cargar la información del activo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivo();
  }, [isOpen, activoId]);

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString();
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-6 outline-none focus:outline-none sm:px-6 lg:px-8">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative mx-auto my-6 w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200/80 outline-none flex flex-col max-h-[90vh]">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 bg-slate-50/80 px-6 py-5 sm:px-8 shrink-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Activo
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Detalles del Activo
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Información completa del activo seleccionado.
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
                    Cargando detalles del activo...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                {error}
              </div>
            ) : activo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Código</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.codigo || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Nombre</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.nombre || "N/A"}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-slate-500">Descripción</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.descripcion || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">ID Categoría</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.categoria_id ?? "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">ID Ubicación</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.ubicacion_id ?? "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Marca</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.marca || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Modelo</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.modelo || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Número de Serie</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.numero_serie || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Estado</h4>
                  <span className="mt-1 inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {activo.estado || "N/A"}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Dirección IP</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.direccion_ip || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Sistema Operativo</h4>
                  <p className="mt-1 text-base text-slate-900">{activo.sistema_operativo || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Fecha de Compra</h4>
                  <p className="mt-1 text-base text-slate-900">{formatDate(activo.fecha_compra)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Fecha de Registro</h4>
                  <p className="mt-1 text-base text-slate-900">{formatDate(activo.fecha_registro)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Valor de Compra</h4>
                  <p className="mt-1 text-base text-slate-900">{formatCurrency(activo.valor_compra)}</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-200/80 bg-slate-50/80 px-6 py-5 sm:px-8 shrink-0">
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

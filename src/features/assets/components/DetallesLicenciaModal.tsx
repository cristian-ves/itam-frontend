import { useEffect, useState } from "react";
import api from "../../../shared/services/api";

interface LicenciaDetalle {
  id: number;
  software: string;
  version: string;
  proveedor: string;
  cantidad_licencias: number;
  tipo_licencia: string;
  fecha_adquisicion: string;
  fecha_vencimiento: string | null;
  costo: string;
  notas: string;
  clave_producto: string;
}

interface DetallesLicenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenciaId: string | number | null;
}

export const DetallesLicenciaModal = ({
  isOpen,
  onClose,
  licenciaId,
}: DetallesLicenciaModalProps) => {
  const [licencia, setLicencia] = useState<LicenciaDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || licenciaId === null) {
      return;
    }

    const fetchLicencia = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<LicenciaDetalle>(`/licencia/${licenciaId}`);
        setLicencia(response.data);
      } catch (err) {
        console.error("Error al obtener los detalles de la licencia:", err);
        setError("No se pudo cargar la información de la licencia.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLicencia();
  }, [isOpen, licenciaId]);

  if (!isOpen) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Add timezone offset to avoid being off by one day for UTC dates
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return isNaN(localDate.getTime()) ? "Fecha inválida" : localDate.toLocaleDateString();
  };

  const formatCurrency = (value?: string | number) => {
    if (value === undefined || value === null) return "N/A";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return value;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(numValue);
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
                Licencia
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Detalles de Licencia
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Información completa de la licencia de software.
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
                    Cargando detalles de la licencia...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                {error}
              </div>
            ) : licencia ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Software</h4>
                  <p className="mt-1 text-base text-slate-900">{licencia.software || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Versión</h4>
                  <p className="mt-1 text-base text-slate-900">{licencia.version || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Proveedor</h4>
                  <p className="mt-1 text-base text-slate-900">{licencia.proveedor || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Clave de Producto</h4>
                  <p className="mt-1 text-base font-mono text-slate-900">{licencia.clave_producto || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Cantidad de Licencias</h4>
                  <p className="mt-1 text-base text-slate-900">{licencia.cantidad_licencias ?? "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Tipo de Licencia</h4>
                  <span className="mt-1 inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {licencia.tipo_licencia || "N/A"}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Fecha de Adquisición</h4>
                  <p className="mt-1 text-base text-slate-900">{formatDate(licencia.fecha_adquisicion)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Fecha de Vencimiento</h4>
                  <p className="mt-1 text-base text-slate-900">{formatDate(licencia.fecha_vencimiento)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Costo</h4>
                  <p className="mt-1 text-base text-slate-900">{formatCurrency(licencia.costo)}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-slate-500">Notas</h4>
                  <p className="mt-1 text-base text-slate-900">{licencia.notas || "N/A"}</p>
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

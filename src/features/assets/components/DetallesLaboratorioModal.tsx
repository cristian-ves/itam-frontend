import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

interface LaboratorioDetalle {
  id_ubicacion: number;
  nombre: string;
  edificio: string;
  piso: string;
  capacidad: number;
  estado: string;
  fecha_creacion?: string;
  // Agrega otros campos si el endpoint los devuelve
}

interface DetallesLaboratorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  laboratorioId: number | null;
}

export const DetallesLaboratorioModal = ({
  isOpen,
  onClose,
  laboratorioId,
}: DetallesLaboratorioModalProps) => {
  const [laboratorio, setLaboratorio] = useState<LaboratorioDetalle | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detailItems = [
    { label: "ID", value: laboratorio?.id_ubicacion || laboratorioId },
    { label: "Nombre", value: laboratorio?.nombre },
    { label: "Edificio", value: laboratorio?.edificio },
    { label: "Piso", value: laboratorio?.piso },
    { label: "Capacidad", value: laboratorio?.capacidad },
    { label: "Estado", value: laboratorio?.estado },
  ];

  useEffect(() => {
    if (!isOpen || laboratorioId === null) {
      return;
    }

    const fetchLaboratorio = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/ubicacion/${laboratorioId}`);
        setLaboratorio(response.data);
      } catch (err) {
        console.error("Error al obtener los detalles del laboratorio:", err);
        setError("No se pudieron cargar los detalles del laboratorio.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaboratorio();
  }, [isOpen, laboratorioId]);

  if (!isOpen) return null;

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
              <div className="mt-1 flex items-center gap-3">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Detalles del Laboratorio
                </h3>
                {laboratorio?.estado ? (
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {laboratorio.estado}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Información general de la ubicación seleccionada.
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
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"></div>
                  <span className="text-sm font-medium">
                    Cargando detalles...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                {error}
              </div>
            ) : laboratorio ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {detailItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 break-words">
                        {item.value ?? "No disponible"}
                      </p>
                    </div>
                  ))}
                </div>

                {laboratorio.fecha_creacion ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Fecha de creación
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {new Date(laboratorio.fecha_creacion).toLocaleDateString(
                        "es-MX",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                No hay datos disponibles.
              </div>
            )}
          </div>
          <div className="flex items-center justify-end border-t border-slate-200/80 bg-slate-50/80 px-6 py-4 sm:px-8">
            <button
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

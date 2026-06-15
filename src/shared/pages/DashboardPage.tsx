import { useEffect, useState } from "react";
import api from "../services/api";

interface DashboardData {
  total_activos: number;
  activos_disponibles: number;
  activos_asignados: number;
  activos_en_mantenimiento: number;
  activos_dados_de_baja: number;
  licencias_por_vencer: number;
  asignaciones_activas: number;
  mantenimientos_proximos: number;
  activos_por_categoria?:
    | Array<{
        nombre: string;
        total: number;
      }>
    | Record<string, number>;
}

interface CategoryBar {
  label: string;
  value: number;
}

interface AssetRecord {
  categoria?: string;
}

interface TableItem {
  id: string;
  activo: string;
  tipo: string;
  detalle: string;
  info: string;
  estado: string;
  estadoColor: string;
}

const getStatusColor = (estado: string) => {
  const lower = estado?.toLowerCase() || "";
  if (lower.includes("disponible") || lower === "activa" || lower === "activo")
    return "bg-green-100 text-green-700";
  if (lower.includes("asignado")) return "bg-blue-100 text-blue-700";
  if (lower.includes("mantenimiento") || lower.includes("crítico"))
    return "bg-red-100 text-red-700";
  if (lower.includes("vencer") || lower.includes("pendiente"))
    return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-700";
};

export const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [categoryBars, setCategoryBars] = useState<CategoryBar[]>([]);
  const [tableItems, setTableItems] = useState<TableItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [
          dashboardResponse,
          activosResponse,
          labsResponse,
          servidoresResponse,
          proyectoresResponse,
          licenciasResponse,
        ] = await Promise.allSettled([
          api.get("/dashboard"),
          api.get("/dashboard/activos"),
          api.get("/ubicacion"),
          api.get("/dashboard/servidores"),
          api.get("/dashboard/proyectores"),
          api.get("/dashboard/licencias"),
        ]);

        if (dashboardResponse.status === "fulfilled") {
          setData(
            dashboardResponse.value.data?.data ?? dashboardResponse.value.data,
          );
        } else {
          throw dashboardResponse.reason;
        }

        if (activosResponse.status === "fulfilled") {
          const activos =
            activosResponse.value.data?.data ?? activosResponse.value.data;
          if (Array.isArray(activos)) {
            const grouped = activos.reduce<Record<string, number>>(
              (accumulator, asset: AssetRecord) => {
                const categoria = asset.categoria?.trim() || "Sin categoría";
                accumulator[categoria] = (accumulator[categoria] || 0) + 1;
                return accumulator;
              },
              {},
            );

            setCategoryBars(
              Object.entries(grouped)
                .map(([label, value]) => ({ label, value }))
                .sort((left, right) => right.value - left.value),
            );
          }
        }

        const items: TableItem[] = [];

        if (labsResponse.status === "fulfilled") {
          const labs =
            labsResponse.value.data?.data ?? labsResponse.value.data ?? [];
          if (Array.isArray(labs)) {
            labs.forEach((lab: any) => {
              items.push({
                id: `lab-${lab.id}`,
                activo: lab.nombre || "Laboratorio",
                tipo: "Laboratorio",
                detalle: lab.edificio || "Sin ubicación",
                info: `Capacidad: ${lab.capacidad || 0}`,
                estado: lab.estado || "Desconocido",
                estadoColor: getStatusColor(lab.estado || ""),
              });
            });
          }
        }

        if (servidoresResponse.status === "fulfilled") {
          const servidores =
            servidoresResponse.value.data?.data ??
            servidoresResponse.value.data ??
            [];
          if (Array.isArray(servidores)) {
            servidores.forEach((srv: any) => {
              const date = srv.ultimo_mantenimiento_fecha
                ? new Date(srv.ultimo_mantenimiento_fecha).toLocaleDateString()
                : "N/A";
              items.push({
                id: `srv-${srv.id}`,
                activo: srv.nombre || "Servidor",
                tipo: "Servidor",
                detalle: `IP: ${srv.direccion_ip || "N/A"}`,
                info: `Mantenimiento: ${date}`,
                estado: srv.estado || "Desconocido",
                estadoColor: getStatusColor(srv.estado || ""),
              });
            });
          }
        }

        if (proyectoresResponse.status === "fulfilled") {
          const proyectores =
            proyectoresResponse.value.data?.data ??
            proyectoresResponse.value.data ??
            [];
          if (Array.isArray(proyectores)) {
            proyectores.forEach((proy: any) => {
              items.push({
                id: `proy-${proy.id}`,
                activo: proy.nombre || "Proyector",
                tipo: "Proyector",
                detalle: proy.marca_y_modelo || "Sin modelo",
                info: `Asignado a: ${proy.laboratorio_asignado || "N/A"}`,
                estado: proy.estado || "Desconocido",
                estadoColor: getStatusColor(proy.estado || ""),
              });
            });
          }
        }

        if (licenciasResponse.status === "fulfilled") {
          const licencias =
            licenciasResponse.value.data?.data ??
            licenciasResponse.value.data ??
            [];
          if (Array.isArray(licencias)) {
            licencias.forEach((lic: any) => {
              const date = lic.fecha_vencimiento
                ? new Date(lic.fecha_vencimiento).toLocaleDateString()
                : "N/A";
              const days = lic.dias_restantes ?? 0;
              const estadoStr = days < 30 ? "Por vencer" : "Activa";
              items.push({
                id: `lic-${lic.id}`,
                activo: `${lic.software} ${lic.version}`,
                tipo: "Licencia",
                detalle: lic.proveedor || "Sin proveedor",
                info: `Vence: ${date} (${days} días)`,
                estado: estadoStr,
                estadoColor: getStatusColor(estadoStr),
              });
            });
          }
        }

        setTableItems(items);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar el dashboard");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <main className="flex-1 p-8 bg-gray-50 flex items-center justify-center h-full">
        <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-100 text-gray-600">
          Cargando dashboard...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-8 bg-gray-50 flex items-center justify-center h-full">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm border border-red-100">
          {error}
        </div>
      </main>
    );
  }

  // Calculamos los porcentajes
  const total = data?.total_activos || 0;
  const safeTotal = total > 0 ? total : 1;
  const assigned = data?.activos_asignados || 0;
  const available = data?.activos_disponibles || 0;
  const maintenance = data?.activos_en_mantenimiento || 0;
  const retired = data?.activos_dados_de_baja || 0;
  const unclassified = Math.max(
    total - (assigned + available + maintenance + retired),
    0,
  );

  const getPercentage = (val: number) => Math.round((val / safeTotal) * 100);
  const statusSegments = [
    { label: "Asignados", value: assigned, color: "#2563eb" },
    { label: "Disponibles", value: available, color: "#16a34a" },
    { label: "Mantenimiento", value: maintenance, color: "#f97316" },
    { label: "Dados de baja", value: retired, color: "#7c3aed" },
    { label: "Sin clasificar", value: unclassified, color: "#cbd5e1" },
  ].filter((segment) => segment.value > 0);
  const ringBackground =
    statusSegments.length > 0
      ? `conic-gradient(${statusSegments
          .map((segment, index) => {
            const start = statusSegments
              .slice(0, index)
              .reduce((sum, current) => sum + current.value, 0);
            const end = start + segment.value;
            return `${segment.color} ${(start / total) * 100}% ${(end / total) * 100}%`;
          })
          .join(", ")})`
      : "conic-gradient(#cbd5e1 0% 100%)";
  const maxCategoryValue = Math.max(
    ...categoryBars.map((category) => category.value),
    1,
  );

  return (
    <main className="flex-1 p-8 bg-gray-50 overflow-y-auto h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
        <p className="text-gray-500 mt-1">
          Resumen del estado de los activos de TI y alertas del sistema.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total de Activos
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data?.total_activos || 0}
            </h3>
            <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                ></path>
              </svg>
              Asignaciones activas: {data?.asignaciones_activas || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 2: Assigned */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Activos Asignados
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data?.activos_asignados || 0}
            </h3>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {getPercentage(assigned)}% del inventario
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 3: Available */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Activos Disponibles
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data?.activos_disponibles || 0}
            </h3>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {getPercentage(available)}% del inventario
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 4: In Maintenance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              En Mantenimiento
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data?.activos_en_mantenimiento || 0}
            </h3>
            <p className="text-xs text-red-500 mt-2 flex items-center font-medium">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              Próximos: {data?.mantenimientos_proximos || 0} | Licencias por
              vencer: {data?.licencias_por_vencer || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 5: Activos Dados de Baja */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Dados de Baja
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data?.activos_dados_de_baja || 0}
            </h3>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {getPercentage(retired)}% del inventario
            </p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 6: Licencias por Vencer */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Licencias por Vencer
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data?.licencias_por_vencer || 0}
            </h3>
            <p className="text-xs text-orange-500 mt-2 font-medium">
              Requieren atención
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 7: Asignaciones Activas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Asignaciones Activas
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data?.asignaciones_activas || 0}
            </h3>
            <p className="text-xs text-blue-500 mt-2 font-medium">
              Equipos en uso
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 8: Mantenimientos Próximos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Mantenimientos Próximos
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data?.mantenimientos_proximos || 0}
            </h3>
            <p className="text-xs text-red-500 mt-2 font-medium">Programados</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Section: Charts / Main visual data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Placeholder for Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Distribución de Activos
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver reporte
            </button>
          </div>
          <div className="h-64 flex items-end justify-around gap-3 pb-4 border-b border-gray-100">
            {categoryBars.length > 0 ? (
              categoryBars.map((category, index) => {
                const height = Math.max(
                  (category.value / maxCategoryValue) * 176,
                  12,
                );
                const barColors = [
                  "bg-blue-500",
                  "bg-indigo-400",
                  "bg-sky-400",
                  "bg-cyan-500",
                  "bg-emerald-500",
                  "bg-amber-500",
                ];
                const hoverColors = [
                  "group-hover:bg-blue-600",
                  "group-hover:bg-indigo-500",
                  "group-hover:bg-sky-500",
                  "group-hover:bg-cyan-600",
                  "group-hover:bg-emerald-600",
                  "group-hover:bg-amber-600",
                ];

                return (
                  <div
                    key={category.label}
                    className="flex flex-col items-center group w-full"
                  >
                    <div
                      className={`w-full max-w-[5rem] ${barColors[index % barColors.length]} rounded-t-md transition-all ${hoverColors[index % hoverColors.length]}`}
                      style={{ height }}
                      title={`${category.label}: ${category.value}`}
                    ></div>
                    <span className="text-xs text-gray-500 mt-3 font-medium text-center">
                      {category.label}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-1 font-semibold">
                      {category.value}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/60">
                <p className="text-sm font-medium text-gray-500">
                  Aún no hay datos de categorías
                </p>
                <p className="text-xs mt-1 max-w-sm">
                  Este gráfico se llenará cuando la API entregue el detalle de
                  activos por categoría.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Placeholder for Pie Chart / Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Estado de los Activos
          </h3>
          <div className="flex flex-col items-center justify-center h-40">
            <div
              className="w-32 h-32 rounded-full relative flex items-center justify-center shadow-inner"
              style={{ background: ringBackground }}
            >
              <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-lg font-bold text-gray-700">{total}</span>
                <span className="text-[10px] uppercase tracking-wide text-gray-400">
                  activos
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>{" "}
                Activos Asignados
              </div>
              <span className="font-semibold text-gray-700">
                {getPercentage(assigned)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>{" "}
                Activos Disponibles
              </div>
              <span className="font-semibold text-gray-700">
                {getPercentage(available)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span>{" "}
                Activos en Reparación
              </div>
              <span className="font-semibold text-gray-700">
                {getPercentage(maintenance)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>{" "}
                Activos Dados de baja
              </div>
              <span className="font-semibold text-gray-700">
                {getPercentage(retired)}%
              </span>
            </div>
            {unclassified > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-slate-300 mr-2"></span>{" "}
                  Sin clasificar
                </div>
                <span className="font-semibold text-gray-700">
                  {getPercentage(unclassified)}%
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Section: Tables/Lists */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">
            Resumen de Elementos
          </h3>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            Ver todos
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Activo</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Detalles</th>
                <th className="px-6 py-4">Información Extra</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {tableItems.length > 0 ? (
                tableItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.activo}
                    </td>
                    <td className="px-6 py-4">{item.tipo}</td>
                    <td className="px-6 py-4">{item.detalle}</td>
                    <td className="px-6 py-4 font-medium">{item.info}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.estadoColor}`}
                      >
                        {item.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No hay elementos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

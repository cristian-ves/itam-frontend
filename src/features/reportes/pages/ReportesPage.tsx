import { useEffect, useState } from "react"
import { useReportes } from "../hooks/useReportes"
import { ReporteTable } from "../components/ReporteTable"
import { ExportButton } from "../components/ExportButton"
import Spinner from "../../../shared/components/atoms/Spinner"

const REPORTES = [
    { key: "activos", label: "Activos" },
    { key: "asignaciones", label: "Asignaciones activas" },
    { key: "laboratorios", label: "Laboratorios" },
    { key: "servidores", label: "Servidores" },
    { key: "proyectores", label: "Proyectores" },
    { key: "licencias", label: "Licencias por vencer" },
    { key: "mantenimientos", label: "Mantenimientos" },
]

const EXPORTS = [
    { tipo: "activos-categoria", label: "Activos por categoría" },
    { tipo: "activos-asignados", label: "Activos asignados" },
    { tipo: "mantenimientos", label: "Mantenimientos" },
    { tipo: "licencias", label: "Licencias por vencer" },
]

const COLUMNS: Record<string, string[]> = {
    activos: ["ID", "Código", "Nombre", "Marca", "Modelo", "No. Serie", "Estado", "Fecha compra", "Valor", "Categoría", "Ubicación"],
    asignaciones: ["ID", "Código activo", "Activo", "Asignado a", "Departamento", "Fecha inicio", "Motivo"],
    laboratorios: ["ID", "Laboratorio", "Edificio/Salón", "Capacidad", "Estado"],
    servidores: ["ID", "Servidor", "Edificio/Salón", "Capacidad", "Estado"],
    proyectores: ["ID", "Proyector", "Edificio/Salón", "Capacidad", "Estado"],
    licencias: ["ID", "Software", "Versión", "Proveedor", "Fecha vencimiento", "Días restantes"],
    mantenimientos: ["ID Activo", "Tipo", "Descripción", "Fecha realizado", "Responsable", "Costo"],
}

export const ReportesPage = () => {
    const {
        activos,
        asignaciones,
        laboratorios,
        servidores,
        proyectores,
        licencias,
        mantenimientos,
        loading,
        exportLoading,
        fetchReporte,
        exportExcel,
    } = useReportes()

    const [activeTab, setActiveTab] = useState("activos")

    const dataMap: Record<string, any[]> = {
        activos,
        asignaciones,
        laboratorios,
        servidores,
        proyectores,
        licencias,
        mantenimientos,
    }

    const handleTabChange = (key: string) => {
        setActiveTab(key)
        if (dataMap[key].length === 0) {
            fetchReporte(key)
        }
    }

    useEffect(() => {
        fetchReporte("activos");
    }, [])

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Consulta y exporta reportes del sistema
                        </p>
                    </div>
                    {/* Exportaciones */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {EXPORTS.map((e) => (
                            <ExportButton
                                key={e.tipo}
                                label={e.label}
                                tipo={e.tipo}
                                exportLoading={exportLoading}
                                onExport={exportExcel}
                            />
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-1">
                        {REPORTES.map((r) => (
                            <button
                                key={r.key}
                                onClick={() => handleTabChange(r.key)}
                                className={`cursor-pointer px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === r.key
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Contenido */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" label="Cargando reporte..." />
                    </div>
                ) : (
                    <ReporteTable
                        columns={COLUMNS[activeTab]}
                        rows={dataMap[activeTab]}
                    />
                )}
            </div>
        </div>
    )
}
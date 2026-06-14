import { useState } from "react";
import { toast } from "sonner";
import {
    getReporteActivos,
    getReporteAsignaciones,
    getReporteLaboratorios,
    getReporteServidores,
    getReporteProyectores,
    getReporteLicencias,
    getReporteMantenimientos,
    exportActivosPorCategoria,
    exportActivosAsignados,
    exportMantenimientos,
    exportLicenciasPorVencer,
    type ReporteActivo,
    type ReporteAsignacion,
    type ReporteLaboratorio,
    type ReporteLicencia,
    type ReporteMantenimiento,
} from "../reportesService";

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

export const useReportes = () => {
    const [activos, setActivos] = useState<ReporteActivo[]>([]);
    const [asignaciones, setAsignaciones] = useState<ReporteAsignacion[]>([]);
    const [laboratorios, setLaboratorios] = useState<ReporteLaboratorio[]>([]);
    const [servidores, setServidores] = useState<ReporteLaboratorio[]>([]);
    const [proyectores, setProyectores] = useState<ReporteLaboratorio[]>([]);
    const [licencias, setLicencias] = useState<ReporteLicencia[]>([]);
    const [mantenimientos, setMantenimientos] = useState<
        ReporteMantenimiento[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState<string | null>(null);

    const fetchReporte = async (tipo: string) => {
        setLoading(true);
        try {
            switch (tipo) {
                case "activos":
                    setActivos(await getReporteActivos());
                    break;
                case "asignaciones":
                    setAsignaciones(await getReporteAsignaciones());
                    break;
                case "laboratorios":
                    setLaboratorios(await getReporteLaboratorios());
                    break;
                case "servidores":
                    setServidores(await getReporteServidores());
                    break;
                case "proyectores":
                    setProyectores(await getReporteProyectores());
                    break;
                case "licencias":
                    setLicencias(await getReporteLicencias());
                    break;
                case "mantenimientos":
                    setMantenimientos(await getReporteMantenimientos());
                    break;
            }
        } catch (err: any) {
            const msg =
                err.response?.data?.message ?? "Error al cargar reporte";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = async (tipo: string) => {
        setExportLoading(tipo);
        try {
            let blob: Blob;
            let filename: string;

            switch (tipo) {
                case "activos-categoria":
                    blob = await exportActivosPorCategoria();
                    filename = "activos-por-categoria.xlsx";
                    break;
                case "activos-asignados":
                    blob = await exportActivosAsignados();
                    filename = "activos-asignados.xlsx";
                    break;
                case "mantenimientos":
                    blob = await exportMantenimientos();
                    filename = "equipos-mantenimiento.xlsx";
                    break;
                case "licencias":
                    blob = await exportLicenciasPorVencer();
                    filename = "licencias-por-vencer.xlsx";
                    break;
                default:
                    return;
            }

            downloadBlob(blob, filename);
            toast.success(`Reporte exportado correctamente`);
        } catch (err: any) {
            const msg =
                err.response?.data?.message ?? "Error al exportar reporte";
            toast.error(msg);
        } finally {
            setExportLoading(null);
        }
    };

    return {
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
    };
};

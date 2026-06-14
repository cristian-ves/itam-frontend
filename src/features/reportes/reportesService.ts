import api from "../../shared/services/api";

// ─── Tipos ────────────────────────────────────────────────
export interface ReporteActivo {
    id: number;
    codigo: string;
    nombre: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    estado: string;
    fecha_compra: string;
    valor_compra: string;
    categoria: string;
    ubicacion: string;
}

export interface ReporteAsignacion {
    id: number;
    codigo_activo: string;
    activo: string;
    asignado_a: string;
    departamento: string;
    fecha_inicio: string;
    motivo: string;
}

export interface ReporteLaboratorio {
    id: number;
    nombre_lab: string;
    edificio_salon: string;
    capacidad: number;
    estado: string;
}

export interface ReporteLicencia {
    id: number;
    software: string;
    version: string;
    proveedor: string;
    fecha_vencimiento: string;
    dias_restantes: number;
}

export interface ReporteMantenimiento {
    activo_id: number;
    tipo: string;
    descripcion: string;
    fecha_realizado: string;
    responsable: string;
    costo: number;
}

// ─── Endpoints JSON ───────────────────────────────────────
export const getReporteActivos = async (): Promise<ReporteActivo[]> => {
    const response = await api.get<ReporteActivo[]>("/reportes/activos");
    return response.data;
};

export const getReporteAsignaciones = async (): Promise<
    ReporteAsignacion[]
> => {
    const response = await api.get<ReporteAsignacion[]>(
        "/reportes/asignaciones"
    );
    return response.data;
};

export const getReporteLaboratorios = async (): Promise<
    ReporteLaboratorio[]
> => {
    const response = await api.get<ReporteLaboratorio[]>(
        "/reportes/laboratorios"
    );
    return response.data;
};

export const getReporteServidores = async (): Promise<ReporteLaboratorio[]> => {
    const response = await api.get<ReporteLaboratorio[]>(
        "/reportes/servidores"
    );
    return response.data;
};

export const getReporteProyectores = async (): Promise<
    ReporteLaboratorio[]
> => {
    const response = await api.get<ReporteLaboratorio[]>(
        "/reportes/proyectores"
    );
    return response.data;
};

export const getReporteLicencias = async (): Promise<ReporteLicencia[]> => {
    const response = await api.get<ReporteLicencia[]>(
        "/reportes/licencias-por-vencer"
    );
    return response.data;
};

export const getReporteMantenimientos = async (): Promise<
    ReporteMantenimiento[]
> => {
    const response = await api.get<ReporteMantenimiento[]>(
        "/reportes/mantenimientos"
    );
    return response.data;
};

// ─── Exportaciones Excel ──────────────────────────────────
export const exportActivosPorCategoria = async (): Promise<Blob> => {
    const response = await api.get("/reportes/activos-por-categoria/excel", {
        responseType: "blob",
    });
    return response.data;
};

export const exportActivosAsignados = async (): Promise<Blob> => {
    const response = await api.get("/reportes/activos-asignados/excel", {
        responseType: "blob",
    });
    return response.data;
};

export const exportMantenimientos = async (): Promise<Blob> => {
    const response = await api.get("/reportes/equipos-mantenimiento/excel", {
        responseType: "blob",
    });
    return response.data;
};

export const exportLicenciasPorVencer = async (): Promise<Blob> => {
    const response = await api.get("/reportes/licencias-por-vencer/excel", {
        responseType: "blob",
    });
    return response.data;
};

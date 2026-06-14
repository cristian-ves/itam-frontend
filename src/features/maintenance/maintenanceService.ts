import api from "../../shared/services/api";

export interface Mantenimiento {
    id: number;
    activo_id: number;
    tipo: "Preventivo" | "Correctivo";
    descripcion?: string;
    fecha_realizado?: string;
    proximo_mantenimiento?: string;
    responsable?: string;
    costo?: number;
}

export interface CreateMantenimientoDto {
    activo_id: number;
    tipo: string;
    descripcion?: string;
    proximo_mantenimiento?: string;
    responsable?: string;
    costo?: number;
}

export interface UpdateMantenimientoDto {
    tipo?: string;
    descripcion?: string;
    proximo_mantenimiento?: string;
    responsable?: string;
    costo?: number;
}

export const getMantenimientos = async (): Promise<Mantenimiento[]> => {
    const response = await api.get<Mantenimiento[]>("/mantenimientos");
    return response.data;
};

export const getMantenimiento = async (id: number): Promise<Mantenimiento> => {
    const response = await api.get<Mantenimiento>(`/mantenimientos/${id}`);
    return response.data;
};

export const getProximos = async (): Promise<Mantenimiento[]> => {
    const response = await api.get<Mantenimiento[]>("/mantenimientos/proximos");
    return response.data;
};

export const getAlertas = async (): Promise<Mantenimiento[]> => {
    const response = await api.get<Mantenimiento[]>("/mantenimientos/alertas");
    return response.data;
};

export const getHistorialByActivo = async (
    activoId: number
): Promise<Mantenimiento[]> => {
    const response = await api.get<Mantenimiento[]>(
        `/mantenimientos/activo/${activoId}`
    );
    return response.data;
};

export const createMantenimiento = async (
    data: CreateMantenimientoDto
): Promise<Mantenimiento> => {
    const response = await api.post<Mantenimiento>("/mantenimientos", data);
    return response.data;
};

export const updateMantenimiento = async (
    id: number,
    data: UpdateMantenimientoDto
): Promise<Mantenimiento> => {
    const response = await api.patch<Mantenimiento>(
        `/mantenimientos/${id}`,
        data
    );
    return response.data;
};

export const deleteMantenimiento = async (id: number): Promise<void> => {
    await api.delete(`/mantenimientos/${id}`);
};

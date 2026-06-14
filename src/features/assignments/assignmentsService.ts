import api from "../../shared/services/api";

export interface Asignacion {
    id: number;
    activo_id: number;
    usuario_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    motivo: string;
    notas: string;
}

export interface CreateAsignacionDto {
    activo_id: number;
    usuario_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    motivo: string;
    notas: string;
}

export interface UpdateAsignacionDto {
    motivo: string;
    notas: string;
    activo_id?: number;
    usuario_id?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
}

export const getAsignaciones = async (): Promise<Asignacion[]> => {
    const response = await api.get<Asignacion[]>("/asignacion");
    return response.data;
};

export const getAsignacion = async (id: number): Promise<Asignacion> => {
    const response = await api.get<Asignacion>(`/asignacion/${id}`);
    return response.data;
};

export const createAsignacion = async (
    data: CreateAsignacionDto
): Promise<Asignacion> => {
    const response = await api.post<Asignacion>("/asignacion", data);
    return response.data;
};

export const updateAsignacion = async (
    id: number,
    data: UpdateAsignacionDto
): Promise<Asignacion> => {
    const response = await api.patch<Asignacion>(`/asignacion/${id}`, data);
    return response.data;
};

export const deleteAsignacion = async (id: number): Promise<void> => {
    await api.delete(`/asignacion/${id}`);
};

import api from "../../shared/services/api";

export interface Rol {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  departamento?: string;
  activo: boolean;
  rol: Rol;
}

export interface CreateUsuarioDto {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol_id: number;
  departamento?: string;
  activo: boolean;
}

export interface UpdateUsuarioDto {
  nombre?: string;
  apellido?: string;
  correo?: string;
  rol_id?: number;
  departamento?: string;
}

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get<Usuario[]>("/usuarios");
  return response.data;
};

export const getUsuario = async (id: number): Promise<Usuario> => {
  const response = await api.get<Usuario>(`/usuarios/${id}`);
  return response.data;
};

export const createUsuario = async (
  data: CreateUsuarioDto,
): Promise<Usuario> => {
  const response = await api.post<Usuario>("/usuarios", data);
  return response.data;
};

export const updateUsuario = async (
  id: number,
  data: UpdateUsuarioDto,
): Promise<Usuario> => {
  const response = await api.patch<Usuario>(`/usuarios/${id}`, data);
  return response.data;
};

export const desactivarUsuario = async (id: number): Promise<Usuario> => {
  const response = await api.patch<Usuario>(`/usuarios/${id}/desactivar`);
  return response.data;
};

export const activarUsuario = async (id: number): Promise<Usuario> => {
  const response = await api.patch<Usuario>(`/usuarios/${id}/activar`);
  return response.data;
};

export const resetPassword = async (
  id: number,
  password: string,
): Promise<{ message: string }> => {
  const response = await api.patch<{ message: string }>(
    `/usuarios/${id}/reset-password`,
    { password },
  );
  return response.data;
};

export const getRoles = async (): Promise<Rol[]> => {
  const response = await api.get<Rol[]>("/roles");
  return response.data;
};

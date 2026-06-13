import api from "../../shared/services/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    rol: string;
  };
}

export const loginService = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await api.post<any>("/auth/login", {
    correo: credentials.email,
    password: credentials.password,
  });

  return {
    token: response.data.access_token,
    user: {
      id: String(response.data.usuario.id),
      name: response.data.usuario.nombre,
      email: response.data.usuario.correo,
      rol: response.data.usuario.rol,
    },
  };
};

export const getPerfilService = async (): Promise<LoginResponse> => {
  const response = await api.get<any>("/auth/perfil");
  return {
    token: localStorage.getItem("token")!,
    user: {
      id: String(response.data.id),
      name: response.data.nombre,
      email: response.data.correo,
      rol: response.data.rol.nombre,
    },
  };
};

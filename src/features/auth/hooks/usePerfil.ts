import { useState } from "react";
import { toast } from "sonner";
import api from "../../../shared/services/api";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useAppDispatch } from "../../../app/hooks";
import { setCredentials } from "../authSlice";

export const usePerfil = () => {
  const { user, token } = useAuth();
  const dispatch = useAppDispatch();

  const [perfilLoading, setPerfilLoading] = useState(false);
  const [perfilError, setPerfilError] = useState<string | null>(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const updatePerfil = async (data: { nombre: string; correo: string }) => {
    setPerfilLoading(true);
    setPerfilError(null);
    try {
      const response = await api.patch("/auth/perfil", data);
      dispatch(
        setCredentials({
          user: {
            id: String(response.data.id),
            name: response.data.nombre,
            email: response.data.correo,
            rol: response.data.rol.nombre,
          },
          token: token!,
        }),
      );
      toast.success("Perfil actualizado correctamente");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al actualizar perfil";
      setPerfilError(msg);
      toast.error(msg);
    } finally {
      setPerfilLoading(false);
    }
  };

  const cambiarPassword = async (data: {
    passwordActual: string;
    passwordNueva: string;
  }) => {
    setPasswordLoading(true);
    setPasswordError(null);
    try {
      await api.patch("/auth/cambiar-password", data);
      toast.success("Contraseña actualizada correctamente");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al cambiar contraseña";
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return {
    user,
    perfilLoading,
    perfilError,
    passwordLoading,
    passwordError,
    updatePerfil,
    cambiarPassword,
  };
};

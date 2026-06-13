import { useState } from "react";
import { toast } from "sonner";
import api from "../../../shared/services/api";

import { setCredentials } from "../authSlice";
import { useAppDispatch } from "../../../app/hooks";
import { useAuth } from "../../../shared/hooks/useAuth";

export const usePerfil = () => {
  const { user, token } = useAuth();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePerfil = async (data: { nombre: string; correo: string }) => {
    setLoading(true);
    setError(null);
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
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const cambiarPassword = async (data: {
    passwordActual: string;
    passwordNueva: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch("/auth/cambiar-password", data);
      toast.success("Contraseña actualizada correctamente");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al cambiar contraseña";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, updatePerfil, cambiarPassword };
};

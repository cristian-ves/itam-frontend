import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getUsuarios,
  getRoles,
  createUsuario,
  updateUsuario,
  desactivarUsuario,
  activarUsuario,
  resetPassword,
  type Usuario,
  type Rol,
  type CreateUsuarioDto,
  type UpdateUsuarioDto,
} from "../usuariosService";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usuariosData, rolesData] = await Promise.all([
        getUsuarios(),
        getRoles(),
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al cargar usuarios";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreateUsuarioDto) => {
    try {
      await createUsuario(data);
      await fetchAll();
      toast.success("Usuario creado correctamente");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al crear usuario";
      toast.error(msg);
      throw err;
    }
  };

  const update = async (id: number, data: UpdateUsuarioDto) => {
    try {
      const updated = await updateUsuario(id, data);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? updated : u)));
      toast.success("Usuario actualizado correctamente");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al actualizar usuario";
      toast.error(msg);
      throw err;
    }
  };

  const desactivar = async (id: number) => {
    try {
      await desactivarUsuario(id);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, activo: false } : u)),
      );
      toast.success("Usuario desactivado correctamente");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al desactivar usuario";
      toast.error(msg);
    }
  };

  const activar = async (id: number) => {
    try {
      await activarUsuario(id);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, activo: true } : u)),
      );
      toast.success("Usuario activado correctamente");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al activar usuario";
      toast.error(msg);
    }
  };

  const reset = async (id: number, password: string) => {
    try {
      await resetPassword(id, password);
      toast.success("Contraseña restablecida correctamente");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? "Error al restablecer contraseña";
      toast.error(msg);
      throw err;
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    usuarios,
    roles,
    loading,
    error,
    create,
    update,
    desactivar,
    activar,
    reset,
    refetch: fetchAll,
  };
};

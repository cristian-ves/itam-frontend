import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Spinner from "../../../shared/components/atoms/Spinner";
import type {
  Usuario,
  Rol,
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from "../usuariosService";

interface Props {
  usuario?: Usuario | null;
  roles: Rol[];
  onClose: () => void;
  onCreate: (data: CreateUsuarioDto) => Promise<void>;
  onUpdate: (id: number, data: UpdateUsuarioDto) => Promise<void>;
}

const emptyForm = {
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
  rol_id: "",
  departamento: "",
  activo: true,
};

export const UsuarioModal = ({
  usuario,
  roles,
  onClose,
  onCreate,
  onUpdate,
}: Props) => {
  const isEditing = !!usuario;
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        password: "",
        rol_id: String(usuario.rol?.id ?? ""),
        departamento: usuario.departamento ?? "",
        activo: usuario.activo,
      });
    } else {
      setForm(emptyForm);
    }
  }, [usuario]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await onUpdate(usuario.id, {
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.correo,
          rol_id: Number(form.rol_id),
          departamento: form.departamento || undefined,
        });
      } else {
        await onCreate({
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.correo,
          password: form.password,
          rol_id: Number(form.rol_id),
          departamento: form.departamento || undefined,
          activo: form.activo,
        });
      }
      onClose();
    } catch {
      // error ya manejado en el hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditing ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                name="rol_id"
                value={form.rol_id}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Seleccionar rol</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                name="departamento"
                value={form.departamento}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="activo"
                id="activo"
                checked={form.activo as boolean}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="activo"
                className="text-sm font-medium text-gray-700"
              >
                Usuario activo
              </label>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : isEditing ? (
                "Guardar cambios"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

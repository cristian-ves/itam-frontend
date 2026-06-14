import { Pencil, KeyRound, UserCheck, UserX } from "lucide-react";
import type { Usuario } from "../usuariosService";

interface Props {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onResetPassword: (usuario: Usuario) => void;
  onToggleActivo: (usuario: Usuario) => void;
}

export const UsuariosTable = ({
  usuarios,
  onEdit,
  onResetPassword,
  onToggleActivo,
}: Props) => {
  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No hay usuarios registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">
              ID
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Nombre
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Correo
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Departamento
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Rol
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Estado
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-500">{u.id}</td>
              <td className="px-4 py-3 text-gray-700 font-medium">
                {u.nombre} {u.apellido}
              </td>
              <td className="px-4 py-3 text-gray-500">{u.correo}</td>
              <td className="px-4 py-3 text-gray-500">
                {u.departamento ?? "—"}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                  {u.rol?.nombre}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onResetPassword(u)}
                    className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                    title="Restablecer contraseña"
                  >
                    <KeyRound size={15} />
                  </button>
                  <button
                    onClick={() => onToggleActivo(u)}
                    className={`cursor-pointer p-1.5 rounded-md transition-colors ${
                      u.activo
                        ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                    }`}
                    title={u.activo ? "Desactivar" : "Activar"}
                  >
                    {u.activo ? <UserX size={15} /> : <UserCheck size={15} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

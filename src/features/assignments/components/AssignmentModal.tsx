import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Spinner from "../../../shared/components/atoms/Spinner";
import type {
  Asignacion,
  CreateAsignacionDto,
  UpdateAsignacionDto,
} from "../assignmentsService";

interface Props {
  asignacion?: Asignacion | null;
  onClose: () => void;
  onCreate: (data: CreateAsignacionDto) => Promise<void>;
  onUpdate: (id: number, data: UpdateAsignacionDto) => Promise<void>;
}

const emptyForm = {
  activo_id: "",
  usuario_id: "",
  fecha_inicio: "",
  fecha_fin: "",
  motivo: "",
  notas: "",
};

export const AssignmentModal = ({
  asignacion,
  onClose,
  onCreate,
  onUpdate,
}: Props) => {
  const isEditing = !!asignacion;
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asignacion) {
      setForm({
        activo_id: String(asignacion.activo_id),
        usuario_id: String(asignacion.usuario_id),
        fecha_inicio: asignacion.fecha_inicio?.slice(0, 10) ?? "",
        fecha_fin: asignacion.fecha_fin?.slice(0, 10) ?? "",
        motivo: asignacion.motivo ?? "",
        notas: asignacion.notas ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [asignacion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await onUpdate(asignacion.id, {
          motivo: form.motivo,
          notas: form.notas,
          activo_id: Number(form.activo_id),
          usuario_id: Number(form.usuario_id),
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin || undefined,
        });
      } else {
        await onCreate({
          activo_id: Number(form.activo_id),
          usuario_id: Number(form.usuario_id),
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin || undefined,
          motivo: form.motivo,
          notas: form.notas,
        });
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditing ? "Editar asignación" : "Nueva asignación"}
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
                ID Activo
              </label>
              <input
                type="number"
                name="activo_id"
                value={form.activo_id}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Usuario
              </label>
              <input
                type="number"
                name="usuario_id"
                value={form.usuario_id}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                // required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <input
              type="text"
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              //   required
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

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

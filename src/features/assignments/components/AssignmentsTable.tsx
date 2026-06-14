import { Pencil, Trash2 } from "lucide-react"
import type { Asignacion } from "../assignmentsService"

interface Props {
    asignaciones: Asignacion[]
    onEdit: (asignacion: Asignacion) => void
    onDelete: (id: number) => void
}

export const AssignmentsTable = ({ asignaciones, onEdit, onDelete }: Props) => {
    if (asignaciones.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">
                No hay asignaciones registradas.
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Activo</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Usuario</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Fecha inicio</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Fecha fin</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Motivo</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Notas</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {asignaciones.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-500">{a.id}</td>
                            <td className="px-4 py-3 text-gray-700">{a.activo_id}</td>
                            <td className="px-4 py-3 text-gray-700">{a.usuario_id}</td>
                            <td className="px-4 py-3 text-gray-500">
                                {a.fecha_inicio
                                    ? new Date(a.fecha_inicio).toLocaleDateString("es-GT")
                                    : "—"}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {a.fecha_fin
                                    ? new Date(a.fecha_fin).toLocaleDateString("es-GT")
                                    : "—"}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{a.motivo}</td>
                            <td className="px-4 py-3 text-gray-500">{a.notas}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(a)}
                                        className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(a.id)}
                                        className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
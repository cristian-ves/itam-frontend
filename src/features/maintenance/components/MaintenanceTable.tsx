import { Pencil, Trash2 } from "lucide-react"
import type { Mantenimiento } from "../maintenanceService"

interface Props {
    mantenimientos: Mantenimiento[]
    onEdit: (mantenimiento: Mantenimiento) => void
    onDelete: (id: number) => void
}

export const MaintenanceTable = ({
    mantenimientos,
    onEdit,
    onDelete,
}: Props) => {
    if (mantenimientos.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">
                No hay mantenimientos registrados.
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
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Descripción</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Responsable</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Costo</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Fecha realizado</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Próximo</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {mantenimientos.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-500">{m.id}</td>
                            <td className="px-4 py-3 text-gray-700">{m.activo_id}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${m.tipo === "Preventivo"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {m.tipo}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{m.descripcion ?? "—"}</td>
                            <td className="px-4 py-3 text-gray-700">{m.responsable ?? "—"}</td>
                            <td className="px-4 py-3 text-gray-500">
                                {m.costo !== undefined && m.costo !== null
                                    ? `Q${Number(m.costo).toFixed(2)}`
                                    : "—"}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {m.fecha_realizado
                                    ? new Date(m.fecha_realizado).toLocaleDateString("es-GT")
                                    : "—"}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {m.proximo_mantenimiento
                                    ? new Date(m.proximo_mantenimiento).toLocaleDateString("es-GT")
                                    : "—"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(m)}
                                        className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(m.id)}
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
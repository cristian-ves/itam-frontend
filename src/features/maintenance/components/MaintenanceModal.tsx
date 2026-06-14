import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Spinner from "../../../shared/components/atoms/Spinner"
import type {
    Mantenimiento,
    CreateMantenimientoDto,
    UpdateMantenimientoDto,
} from "../maintenanceService"

interface Props {
    mantenimiento?: Mantenimiento | null
    onClose: () => void
    onCreate: (data: CreateMantenimientoDto) => Promise<void>
    onUpdate: (id: number, data: UpdateMantenimientoDto) => Promise<void>
}

const emptyForm = {
    activo_id: "",
    tipo: "Preventivo",
    descripcion: "",
    fecha_realizado: "",
    proximo_mantenimiento: "",
    responsable: "",
    costo: "",
}

export const MaintenanceModal = ({
    mantenimiento,
    onClose,
    onCreate,
    onUpdate,
}: Props) => {
    const isEditing = !!mantenimiento
    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (mantenimiento) {
            setForm({
                activo_id: String(mantenimiento.activo_id),
                tipo: mantenimiento.tipo,
                descripcion: mantenimiento.descripcion ?? "",
                fecha_realizado: mantenimiento.fecha_realizado?.slice(0, 10) ?? "",
                proximo_mantenimiento:
                    mantenimiento.proximo_mantenimiento?.slice(0, 10) ?? "",
                responsable: mantenimiento.responsable ?? "",
                costo: mantenimiento.costo !== undefined ? String(mantenimiento.costo) : "",
            })
        } else {
            setForm(emptyForm)
        }
    }, [mantenimiento])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (isEditing) {
                await onUpdate(mantenimiento.id, {
                    tipo: form.tipo,
                    descripcion: form.descripcion || undefined,
                    proximo_mantenimiento: form.proximo_mantenimiento || undefined,
                    responsable: form.responsable || undefined,
                    costo: form.costo ? Number(form.costo) : undefined,
                })
            } else {
                await onCreate({
                    activo_id: Number(form.activo_id),
                    tipo: form.tipo,
                    descripcion: form.descripcion || undefined,
                    proximo_mantenimiento: form.proximo_mantenimiento || undefined,
                    responsable: form.responsable || undefined,
                    costo: form.costo ? Number(form.costo) : undefined,
                })
            }
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isEditing ? "Editar mantenimiento" : "Nuevo mantenimiento"}
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
                                disabled={isEditing}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo
                            </label>
                            <select
                                name="tipo"
                                value={form.tipo}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Preventivo">Preventivo</option>
                                <option value="Correctivo">Correctivo</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Responsable
                            </label>
                            <input
                                type="text"
                                name="responsable"
                                value={form.responsable}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Costo (Q)
                            </label>
                            <input
                                type="number"
                                name="costo"
                                value={form.costo}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className={`grid gap-4 ${isEditing ? "grid-cols-2" : "grid-cols-1"}`}>
                        {isEditing && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha realizado
                                </label>
                                <input
                                    type="date"
                                    name="fecha_realizado"
                                    value={form.fecha_realizado}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Próximo mantenimiento
                            </label>
                            <input
                                type="date"
                                name="proximo_mantenimiento"
                                value={form.proximo_mantenimiento}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
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
    )
}
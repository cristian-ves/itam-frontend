import { useState } from "react"
import { Plus } from "lucide-react"
import { useAssignments } from "../hooks/useAssignments"
import { AssignmentsTable } from "../components/AssignmentsTable"
import { AssignmentModal } from "../components/AssignmentModal"
import Spinner from "../../../shared/components/atoms/Spinner"
import type { Asignacion } from "../assignmentsService"

export const AssignmentsPage = () => {
    const { asignaciones, loading, error, create, update, remove } = useAssignments()
    const [selected, setSelected] = useState<Asignacion | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleEdit = (asignacion: Asignacion) => {
        setSelected(asignacion)
        setModalOpen(true)
    }

    const handleNew = () => {
        setSelected(null)
        setModalOpen(true)
    }

    const handleClose = () => {
        setSelected(null)
        setModalOpen(false)
    }

    const handleDelete = async (id: number) => {
        const confirm = window.confirm("¿Estás seguro de eliminar esta asignación?")
        if (confirm) await remove(id)
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Asignaciones</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Gestión de asignaciones de activos
                        </p>
                    </div>
                    <button
                        onClick={handleNew}
                        className="cursor-pointer flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={16} />
                        Nueva asignación
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" label="Cargando asignaciones..." />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 text-sm">{error}</div>
                ) : (
                    <AssignmentsTable
                        asignaciones={asignaciones}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <AssignmentModal
                    asignacion={selected}
                    onClose={handleClose}
                    onCreate={create}
                    onUpdate={update}
                />
            )}
        </div>
    )
}
import { useState } from "react"
import { Plus } from "lucide-react"
import { useMaintenance } from "../hooks/useMaintenance"
import { MaintenanceTable } from "../components/MaintenanceTable"
import { MaintenanceModal } from "../components/MaintenanceModal"
import { MaintenanceAlerts } from "../components/MaintenanceAlerts"
import Spinner from "../../../shared/components/atoms/Spinner"
import type { Mantenimiento } from "../maintenanceService"
import { ConfirmModal } from "../../../shared/components/molecules/ConfirmModal"

export const MaintenancePage = () => {
    const {
        mantenimientos,
        alertas,
        proximos,
        loading,
        error,
        create,
        update,
        remove,
    } = useMaintenance()

    const [selected, setSelected] = useState<Mantenimiento | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleEdit = (mantenimiento: Mantenimiento) => {
        setSelected(mantenimiento)
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

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setDeleteId(id)
    }

    const handleConfirmDelete = async () => {
        if (deleteId !== null) {
            await remove(deleteId)
            setDeleteId(null)
        }
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Mantenimiento</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Gestión y seguimiento de mantenimientos
                        </p>
                    </div>
                    <button
                        onClick={handleNew}
                        className="cursor-pointer flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={16} />
                        Nuevo mantenimiento
                    </button>
                </div>

                {/* Alertas y próximos */}
                {!loading && (
                    <MaintenanceAlerts alertas={alertas} proximos={proximos} />
                )}

                {/* Tabla */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" label="Cargando mantenimientos..." />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 text-sm">{error}</div>
                ) : (
                    <MaintenanceTable
                        mantenimientos={mantenimientos}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <MaintenanceModal
                    mantenimiento={selected}
                    onClose={handleClose}
                    onCreate={create}
                    onUpdate={update}
                />
            )}

            {deleteId !== null && (
                <ConfirmModal
                    title="Eliminar mantenimiento"
                    message="¿Estás seguro de que deseas eliminar este mantenimiento? Esta acción no se puede deshacer."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    )
}
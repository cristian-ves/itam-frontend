import { AlertTriangle, X } from "lucide-react"

interface Props {
    title: string
    message: string
    confirmLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

export const ConfirmModal = ({
    title,
    message,
    confirmLabel = "Eliminar",
    onConfirm,
    onCancel,
}: Props) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-500" />
                        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-600">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
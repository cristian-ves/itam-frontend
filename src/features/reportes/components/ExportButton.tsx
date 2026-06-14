import { Download } from "lucide-react"
import Spinner from "../../../shared/components/atoms/Spinner"

interface Props {
    label: string
    tipo: string
    exportLoading: boolean
    onExport: (tipo: string) => void
}

export const ExportButton = ({
    label,
    tipo,
    exportLoading,
    onExport,
}: Props) => {
    return (
        <button
            onClick={() => onExport(tipo)}
            disabled={exportLoading}
            className="cursor-pointer flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {exportLoading ? (
                <Spinner size="sm" />
            ) : (
                <Download size={14} />
            )}
            {label}
        </button>
    )
}
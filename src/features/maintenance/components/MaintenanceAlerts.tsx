import { AlertTriangle, Clock } from "lucide-react"
import type { Mantenimiento } from "../maintenanceService"

interface Props {
    alertas: Mantenimiento[]
    proximos: Mantenimiento[]
}

export const MaintenanceAlerts = ({ alertas, proximos }: Props) => {
    if (alertas.length === 0 && proximos.length === 0) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alertas — próximos 30 días */}
            {alertas.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} className="text-red-500" />
                        <h3 className="text-sm font-semibold text-red-700">
                            Requieren atención ({alertas.length})
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {alertas.map((m) => (
                            <li
                                key={m.id}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="text-red-700">Activo #{m.activo_id}</span>
                                <span className="text-red-500 text-xs">
                                    {m.proximo_mantenimiento
                                        ? new Date(m.proximo_mantenimiento).toLocaleDateString("es-GT")
                                        : "—"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Próximos mantenimientos */}
            {proximos.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock size={16} className="text-amber-500" />
                        <h3 className="text-sm font-semibold text-amber-700">
                            Próximos mantenimientos ({proximos.length})
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {proximos.map((m) => (
                            <li
                                key={m.id}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="text-amber-700">
                                    Activo #{m.activo_id} — {m.tipo}
                                </span>
                                <span className="text-amber-500 text-xs">
                                    {m.proximo_mantenimiento
                                        ? new Date(m.proximo_mantenimiento).toLocaleDateString("es-GT")
                                        : "—"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
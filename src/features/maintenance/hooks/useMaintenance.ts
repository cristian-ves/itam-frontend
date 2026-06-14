import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    getMantenimientos,
    getAlertas,
    getProximos,
    createMantenimiento,
    updateMantenimiento,
    deleteMantenimiento,
    type Mantenimiento,
    type CreateMantenimientoDto,
    type UpdateMantenimientoDto,
} from "../maintenanceService";

export const useMaintenance = () => {
    const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
    const [alertas, setAlertas] = useState<Mantenimiento[]>([]);
    const [proximos, setProximos] = useState<Mantenimiento[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const [data, alertasData, proximosData] = await Promise.all([
                getMantenimientos(),
                getAlertas(),
                getProximos(),
            ]);
            setMantenimientos(data);
            setAlertas(alertasData);
            setProximos(proximosData);
        } catch (err: any) {
            const msg =
                err.response?.data?.message ?? "Error al cargar mantenimientos";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const create = async (data: CreateMantenimientoDto) => {
        try {
            const nuevo = await createMantenimiento(data);
            setMantenimientos((prev) => [...prev, nuevo]);
            toast.success("Mantenimiento creado correctamente");
        } catch (err: any) {
            const msg =
                err.response?.data?.message ?? "Error al crear mantenimiento";
            toast.error(msg);
        }
    };

    const update = async (id: number, data: UpdateMantenimientoDto) => {
        try {
            const updated = await updateMantenimiento(id, data);
            setMantenimientos((prev) =>
                prev.map((m) => (m.id === id ? updated : m))
            );
            toast.success("Mantenimiento actualizado correctamente");
        } catch (err: any) {
            const msg =
                err.response?.data?.message ??
                "Error al actualizar mantenimiento";
            toast.error(msg);
        }
    };

    const remove = async (id: number) => {
        try {
            await deleteMantenimiento(id);
            setMantenimientos((prev) => prev.filter((m) => m.id !== id));
            toast.success("Mantenimiento eliminado correctamente");
        } catch (err: any) {
            const msg =
                err.response?.data?.message ??
                "Error al eliminar mantenimiento";
            toast.error(msg);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    return {
        mantenimientos,
        alertas,
        proximos,
        loading,
        error,
        create,
        update,
        remove,
        refetch: fetchAll,
    };
};

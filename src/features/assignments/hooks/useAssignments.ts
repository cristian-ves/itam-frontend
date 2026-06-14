import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    getAsignaciones,
    createAsignacion,
    updateAsignacion,
    deleteAsignacion,
    type Asignacion,
    type CreateAsignacionDto,
    type UpdateAsignacionDto,
} from "../assignmentsService";

export const useAssignments = () => {
    const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAsignaciones = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAsignaciones();
            setAsignaciones(data);
        } catch (err: any) {
            const msg =
                err.response?.data?.message ?? "Error al cargar asignaciones";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const create = async (data: CreateAsignacionDto) => {
        try {
            const nueva = await createAsignacion(data);
            setAsignaciones((prev) => [...prev, nueva]);
            toast.success("Asignación creada correctamente");
        } catch (err: any) {
            const msg =
                err.response?.data?.message ?? "Error al crear asignación";
            toast.error(msg);
        }
    };

    const update = async (id: number, data: UpdateAsignacionDto) => {
        try {
            await updateAsignacion(id, data);
            setAsignaciones((prev) =>
                prev.map((a) => (a.id === id ? { ...a, ...data } : a))
            );
            toast.success("Asignación actualizada correctamente");
        } catch (err: any) {
            const msg =
                err.response?.data?.message ?? "Error al actualizar asignación";
            toast.error(msg);
        }
    };

    const remove = async (id: number) => {
        try {
            await deleteAsignacion(id);
            setAsignaciones((prev) => prev.filter((a) => a.id !== id));
            toast.success("Asignación eliminada correctamente");
        } catch (err: any) {
            const msg =
                err.response?.data?.message ?? "Error al eliminar asignación";
            toast.error(msg);
        }
    };

    useEffect(() => {
        fetchAsignaciones();
    }, []);

    return {
        asignaciones,
        loading,
        error,
        create,
        update,
        remove,
        refetch: fetchAsignaciones,
    };
};

import type { ColumnDef } from "../reportesTypes";

export const REPORTES = [
    { key: "activos", label: "Activos" },
    { key: "asignaciones", label: "Asignaciones activas" },
    { key: "laboratorios", label: "Laboratorios" },
    { key: "servidores", label: "Servidores" },
    { key: "proyectores", label: "Proyectores" },
    { key: "licencias", label: "Licencias por vencer" },
    { key: "mantenimientos", label: "Mantenimientos" },
];

export const EXPORTS = [
    { tipo: "activos-categoria", label: "Activos por categoría" },
    { tipo: "activos-asignados", label: "Activos asignados" },
    { tipo: "mantenimientos", label: "Mantenimientos" },
    { tipo: "licencias", label: "Licencias por vencer" },
];

const formatDate = (val: any) =>
    val ? new Date(val).toLocaleDateString("es-GT") : "—";

const formatMoney = (val: any) =>
    val !== null && val !== undefined
        ? `Q${Number(val).toLocaleString("es-GT", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })}`
        : "—";

export const COLUMNS: Record<string, ColumnDef[]> = {
    activos: [
        { label: "ID" },
        { label: "Código" },
        { label: "Nombre" },
        { label: "Marca" },
        { label: "Modelo" },
        { label: "No. Serie" },
        { label: "Estado" },
        { label: "Fecha compra", format: formatDate },
        { label: "Valor", format: formatMoney },
        { label: "Categoría" },
        { label: "Ubicación" },
    ],
    asignaciones: [
        { label: "ID" },
        { label: "Código activo" },
        { label: "Activo" },
        { label: "Asignado a" },
        { label: "Departamento" },
        { label: "Fecha inicio", format: formatDate },
        { label: "Motivo" },
    ],
    laboratorios: [
        { label: "ID" },
        { label: "Laboratorio" },
        { label: "Edificio/Salón" },
        { label: "Capacidad" },
        { label: "Estado" },
    ],
    servidores: [
        { label: "ID" },
        { label: "Nombre" },
        { label: "Dirección IP" },
        { label: "Sistema Operativo" },
        { label: "Estado" },
        { label: "Último mantenimiento", format: formatDate },
    ],
    proyectores: [
        { label: "ID" },
        { label: "Proyector" },
        { label: "Edificio/Salón" },
        { label: "Capacidad" },
        { label: "Estado" },
    ],
    licencias: [
        { label: "ID" },
        { label: "Software" },
        { label: "Versión" },
        { label: "Proveedor" },
        { label: "Fecha vencimiento", format: formatDate },
        { label: "Días restantes" },
    ],
    mantenimientos: [
        { label: "ID" },
        { label: "ID Activo" },
        { label: "Tipo" },
        { label: "Descripción" },
        { label: "Fecha realizado", format: formatDate },
        { label: "Próximo mantenimiento", format: formatDate },
        { label: "Responsable" },
        { label: "Costo", format: formatMoney },
    ],
};

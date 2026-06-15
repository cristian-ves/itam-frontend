import { useMemo, useState, type ChangeEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  UploadCloud,
  X,
} from "lucide-react";
import api from "../../../shared/services/api";

type UploadKey =
  | "usuarios-carga"
  | "activos-carga"
  | "asignaciones-carga"
  | "mantenimientos-carga"
  | "ubicaciones-carga"
  | "licencias-asignadas-carga"
  | "licencias-asignadas-especial-carga";

type UploadConfig = {
  key: UploadKey;
  title: string;
  description: string;
  fields: string[];
  separator: string;
  note: string;
  endpoint: string;
};

type UploadState = {
  file: File | null;
  error: string | null;
  uploading: boolean;
  success: string | null;
};

const UPLOADS: UploadConfig[] = [
  {
    key: "usuarios-carga",
    title: "Carga de Usuarios",
    description: "Importa usuarios del sistema con su rol y datos de acceso.",
    fields: [
      "nombre",
      "apellido",
      "correo",
      "rol_id",
      "departamento",
      "activo",
      "fecha_registro",
      "password",
    ],
    separator: "Coma",
    note: "El campo activo se interpreta como booleano.",
    endpoint: "/usuarios-carga/cargar-csv",
  },
  {
    key: "activos-carga",
    title: "Carga de Activos",
    description: "Carga activos con sus datos de identificación y ubicación.",
    fields: [
      "codigo",
      "nombre",
      "descripcion",
      "categoria_id",
      "marca",
      "modelo",
      "numero_serie",
      "estado",
      "ubicacion_id",
      "fecha_compra",
      "fecha_registro",
      "valor_compra",
      "direccion_ip",
      "sistema_operativo",
    ],
    separator: "Coma",
    note: "El campo id no se incluye porque es autogenerado.",
    endpoint: "/activos-carga/cargar-csv",
  },
  {
    key: "asignaciones-carga",
    title: "Carga de Asignaciones",
    description: "Registra la asignación de activos a usuarios.",
    fields: [
      "activo_id",
      "usuario_id",
      "fecha_inicio",
      "fecha_fin",
      "motivo",
      "notas",
    ],
    separator: "Coma",
    note: "El campo id no se incluye porque es autogenerado.",
    endpoint: "/asignaciones-carga/cargar-csv",
  },
  {
    key: "mantenimientos-carga",
    title: "Carga de Mantenimientos",
    description: "Importa mantenimientos realizados y programados.",
    fields: [
      "activo_id",
      "tipo",
      "descripcion",
      "fecha_realizado",
      "proximo_mantenimiento",
      "responsable",
      "costo",
    ],
    separator: "Coma",
    note: "El campo id no se incluye porque es autogenerado.",
    endpoint: "/mantenimientos-carga/cargar-csv",
  },
  {
    key: "ubicaciones-carga",
    title: "Carga de Ubicaciones",
    description: "Carga ubicaciones físicas disponibles para los activos.",
    fields: ["nombre", "edificio", "piso", "capacidad", "estado"],
    separator: "Coma",
    note: "El campo id no se incluye porque es autogenerado.",
    endpoint: "/ubicaciones-carga/cargar-csv",
  },
  {
    key: "licencias-asignadas-carga",
    title: "Carga de Licencias Asignadas",
    description: "Asigna licencias a activos o usuarios con control de fecha.",
    fields: ["licencia_id", "activo_id", "usuario_id", "fecha_asignacion"],
    separator: "Tabulador",
    note:
      "Este archivo debe usar tabulador como separador, no coma. El campo id no se incluye porque es autogenerado.",
    endpoint: "/licencias-asignadas-carga/cargar-csv",
  },
  {
    key: "licencias-asignadas-especial-carga",
    title: "Carga de Licencias Asignadas (subcarpeta licencias)",
    description:
      "Carga especial para licencias asignadas desde la subcarpeta de licencias.",
    fields: ["licencia_id", "activo_id", "usuario_id", "fecha_asignacion"],
    separator: "Tabulador",
    note:
      "Este archivo debe usar tabulador como separador, no coma. El campo id no se incluye porque es autogenerado.",
    endpoint: "/licencias-asignadas/cargar-csv",
  },
];

const initialState = UPLOADS.reduce<Record<UploadKey, UploadState>>(
  (accumulator, upload) => {
    accumulator[upload.key] = {
      file: null,
      error: null,
      uploading: false,
      success: null,
    };
    return accumulator;
  },
  {} as Record<UploadKey, UploadState>,
);

const isCsvFile = (file: File) => file.name.toLowerCase().endsWith(".csv");

export const CargaMasivaPage = () => {
  const [uploads, setUploads] = useState(initialState);

  const fileSummary = useMemo(
    () =>
      UPLOADS.map((upload, index) => ({
        ...upload,
        renderKey: `${upload.key}-${index}`,
        state: uploads[upload.key],
      })),
    [uploads],
  );

  const handleFileChange =
    (key: UploadKey) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;

      if (!file) {
        setUploads((current) => ({
          ...current,
          [key]: { file: null, error: null, uploading: false, success: null },
        }));
        return;
      }

      if (!isCsvFile(file)) {
        setUploads((current) => ({
          ...current,
          [key]: {
            file: null,
            error: "Solo se permiten archivos .csv.",
            uploading: false,
            success: null,
          },
        }));
        event.target.value = "";
        return;
      }

      setUploads((current) => ({
        ...current,
        [key]: { file, error: null, uploading: false, success: null },
      }));
    };

  const clearFile = (key: UploadKey) => {
    setUploads((current) => ({
      ...current,
      [key]: { file: null, error: null, uploading: false, success: null },
    }));
  };

  const uploadFile = async (key: UploadKey) => {
    const config = UPLOADS.find((upload) => upload.key === key);
    const current = uploads[key];

    if (!config || !current.file) {
      setUploads((state) => ({
        ...state,
        [key]: {
          ...state[key],
          error: "Selecciona primero un archivo .csv.",
          success: null,
        },
      }));
      return;
    }

    setUploads((state) => ({
      ...state,
      [key]: {
        ...state[key],
        uploading: true,
        error: null,
        success: null,
      },
    }));

    try {
      const formData = new FormData();
      formData.append("file", current.file);

      await api.post(config.endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploads((state) => ({
        ...state,
        [key]: {
          file: null,
          error: null,
          uploading: false,
          success: "Archivo cargado correctamente.",
        },
      }));
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo cargar el archivo.";

      setUploads((state) => ({
        ...state,
        [key]: {
          ...state[key],
          uploading: false,
          error: message,
          success: null,
        },
      }));
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-8 py-10 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-300">
              Carga masiva
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Importa archivos por módulo de manera independiente
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-200 sm:text-base">
              Cada bloque representa una carga separada. Sube únicamente archivos
              CSV, respeta el orden de columnas indicado y usa tabulador solo en
              licencias asignadas.
            </p>
          </div>

          <div className="grid gap-4 border-t border-slate-200 bg-slate-50 px-8 py-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Formato permitido
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Solo archivos con extensión .csv.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estructura
              </p>
              <p className="mt-2 text-sm text-slate-700">
                La primera fila debe contener los encabezados exactamente como se
                muestran abajo.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Observaciones
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Los campos id no se incluyen; son autogenerados por el sistema.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {fileSummary.map((upload) => {
            const hasFile = Boolean(upload.state.file);

            return (
              <article
                key={upload.renderKey}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Carga individual
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      {upload.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {upload.description}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                    <FileText size={20} />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <span>Separador: {upload.separator}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{upload.fields.length} columnas</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {upload.fields.map((field) => (
                      <span
                        key={field}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-slate-400 hover:bg-slate-100/80">
                  <UploadCloud className="text-slate-500" size={28} />
                  <span className="mt-3 text-sm font-semibold text-slate-800">
                    Seleccionar archivo CSV
                  </span>
                  <span className="mt-1 text-xs leading-5 text-slate-500">
                    Sube el archivo correspondiente para esta carga específica.
                  </span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="sr-only"
                    onChange={handleFileChange(upload.key)}
                  />
                </label>

                <div className="mt-4 flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Archivo seleccionado
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-800">
                      {upload.state.file?.name ?? "Ninguno"}
                    </p>
                    {upload.state.error ? (
                      <p className="mt-2 flex items-center gap-2 text-sm text-rose-600">
                        <AlertTriangle size={16} />
                        {upload.state.error}
                      </p>
                    ) : upload.state.success ? (
                      <p className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle2 size={16} />
                        {upload.state.success}
                      </p>
                    ) : hasFile ? (
                      <p className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle2 size={16} />
                        Archivo válido listo para cargar.
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        Esperando un archivo .csv.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => clearFile(upload.key)}
                    disabled={upload.state.uploading}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                    aria-label={`Limpiar archivo de ${upload.title}`}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Endpoint: {upload.endpoint}
                  </div>
                  <button
                    type="button"
                    onClick={() => uploadFile(upload.key)}
                    disabled={upload.state.uploading || !upload.state.file}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <UploadCloud size={16} />
                    {upload.state.uploading ? "Cargando..." : "Cargar archivo"}
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <p className="font-semibold">Aclaración de estructura</p>
                  <p className="mt-1 leading-6">{upload.note}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Resumen de columnas por carga
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Verifica estos encabezados antes de enviar cada archivo.
              </p>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
              6 cargas independientes
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 md:divide-y-0 md:divide-x">
              {UPLOADS.map((upload) => (
                <div key={upload.key} className="bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {upload.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {upload.fields.join(", ")}
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Separador: {upload.separator}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

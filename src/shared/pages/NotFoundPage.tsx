import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="animate-pulse text-9xl font-extrabold tracking-tight text-indigo-600">
        404
      </h1>
      <p className="mt-4 text-2xl font-semibold text-gray-700">
        Página no encontrada
      </p>
      <p className="mt-2 text-gray-500">
        Lo sentimos, la página que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

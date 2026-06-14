import { useState } from "react";
import { usePerfil } from "../hooks/usePerfil";
import Spinner from "../../../shared/components/atoms/Spinner";

export const ChangePasswordForm = () => {
  const { passwordLoading, passwordError, cambiarPassword } = usePerfil();
  const [form, setForm] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmar: "",
  });
  const [matchError, setMatchError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatchError(null);
    if (form.passwordNueva !== form.confirmar) {
      setMatchError("Las contraseñas no coinciden");
      return;
    }
    await cambiarPassword({
      passwordActual: form.passwordActual,
      passwordNueva: form.passwordNueva,
    });
    setForm({ passwordActual: "", passwordNueva: "", confirmar: "" });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Cambiar contraseña
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña actual
          </label>
          <input
            type="password"
            name="passwordActual"
            value={form.passwordActual}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <input
            type="password"
            name="passwordNueva"
            value={form.passwordNueva}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            name="confirmar"
            value={form.confirmar}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {matchError && <p className="text-sm text-red-500">{matchError}</p>}
        {passwordError && (
          <p className="text-sm text-red-500">{passwordError}</p>
        )}
        <button
          type="submit"
          disabled={passwordLoading}
          className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {passwordLoading ? <Spinner size="sm" /> : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
};

import { useState } from "react";
import { Plus } from "lucide-react";
import { useUsuarios } from "../hooks/useUsuarios";
import { UsuariosTable } from "../components/UsuariosTable";
import { UsuarioModal } from "../components/UsuarioModal";
import { ResetPasswordModal } from "../components/ResetPasswordModal";
import { ConfirmModal } from "../../../shared/components/molecules/ConfirmModal";
import Spinner from "../../../shared/components/atoms/Spinner";
import type { Usuario } from "../usuariosService";

export const UsuariosPage = () => {
  const {
    usuarios,
    roles,
    loading,
    error,
    create,
    update,
    desactivar,
    activar,
    reset,
  } = useUsuarios();

  const [selected, setSelected] = useState<Usuario | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resetModal, setResetModal] = useState<Usuario | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Usuario | null>(null);

  const handleNew = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelected(usuario);
    setModalOpen(true);
  };

  const handleClose = () => {
    setSelected(null);
    setModalOpen(false);
  };

  const handleToggleActivo = (usuario: Usuario) => {
    setToggleTarget(usuario);
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    if (toggleTarget.activo) {
      await desactivar(toggleTarget.id);
    } else {
      await activar(toggleTarget.id);
    }
    setToggleTarget(null);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestión de usuarios del sistema
            </p>
          </div>
          <button
            onClick={handleNew}
            className="cursor-pointer flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Nuevo usuario
          </button>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" label="Cargando usuarios..." />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 text-sm">{error}</div>
        ) : (
          <UsuariosTable
            usuarios={usuarios}
            onEdit={handleEdit}
            onResetPassword={setResetModal}
            onToggleActivo={handleToggleActivo}
          />
        )}
      </div>

      {/* Modal crear/editar */}
      {modalOpen && (
        <UsuarioModal
          usuario={selected}
          roles={roles}
          onClose={handleClose}
          onCreate={create}
          onUpdate={update}
        />
      )}

      {/* Modal reset password */}
      {resetModal && (
        <ResetPasswordModal
          usuario={resetModal}
          onClose={() => setResetModal(null)}
          onReset={reset}
        />
      )}

      {/* Confirm activar/desactivar */}
      {toggleTarget && (
        <ConfirmModal
          title={toggleTarget.activo ? "Desactivar usuario" : "Activar usuario"}
          message={
            toggleTarget.activo
              ? `¿Desactivar a ${toggleTarget.nombre} ${toggleTarget.apellido}? No podrá iniciar sesión.`
              : `¿Activar a ${toggleTarget.nombre} ${toggleTarget.apellido}? Podrá iniciar sesión nuevamente.`
          }
          confirmLabel={toggleTarget.activo ? "Desactivar" : "Activar"}
          onConfirm={handleConfirmToggle}
          onCancel={() => setToggleTarget(null)}
        />
      )}
    </div>
  );
};

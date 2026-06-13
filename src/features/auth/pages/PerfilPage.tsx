import { UserInfoCard } from "../components/UserInfoCard";
import { EditPerfilForm } from "../components/EditPerfilForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";

export const PerfilPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi perfil</h1>
      <UserInfoCard />
      <EditPerfilForm />
      <ChangePasswordForm />
    </div>
  );
};

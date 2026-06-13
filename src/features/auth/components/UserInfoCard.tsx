import { User, Mail, Shield } from "lucide-react";
import { useAuth } from "../../../shared/hooks/useAuth";

export const UserInfoCard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-indigo-600">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mt-1">
            <Shield size={11} />
            {user?.rol}
          </span>
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <User size={16} className="text-gray-400 shrink-0" />
          <span>{user?.name}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400 shrink-0" />
          <span>{user?.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Shield size={16} className="text-gray-400 shrink-0" />
          <span>{user?.rol}</span>
        </div>
      </div>
    </div>
  );
};

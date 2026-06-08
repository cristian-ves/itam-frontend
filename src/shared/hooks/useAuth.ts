import { useAppSelector } from "../../app/hooks";

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    //TODO: Implement roles if thery're used on the backend
    //  isAdmin: auth.user?.role === "admin",
  };
};

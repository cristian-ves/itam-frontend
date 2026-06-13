import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "./app/hooks";
import { restoreSessionThunk, setIsRestoring } from "./features/auth/authSlice";
import router from "./shared/router";

const App = () => {
  const dispatch = useAppDispatch();

  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      dispatch(restoreSessionThunk()).then((result) => {
        if (restoreSessionThunk.fulfilled.match(result)) {
          toast.success(`Bienvenido de nuevo, ${result.payload.user.name}`);
        }
      });
    } else {
      dispatch(setIsRestoring(false));
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;

import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
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
      dispatch(restoreSessionThunk());
    } else {
      dispatch(setIsRestoring(false));
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;

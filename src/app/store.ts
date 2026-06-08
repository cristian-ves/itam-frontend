import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

// const token = localStorage.getItem("token");

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // TODO: Add this when backend implemented
  // preloadedState: {
  //   auth: {
  //     user: null,
  //     token: token,
  //     isAuthenticated: !!token,
  //     loading: false,
  //     error: null,
  //   },
  // },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

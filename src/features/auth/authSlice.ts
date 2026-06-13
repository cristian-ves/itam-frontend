import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getPerfilService,
  loginService,
  type LoginCredentials,
  type LoginResponse,
} from "./authService";

interface AuthState {
  user: { id: string; name: string; email: string; rol: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isRestoring: boolean;
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: false,
  loading: false,
  error: null,
  isRestoring: true,
};

export const loginThunk = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginService(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error al iniciar sesión",
      );
    }
  },
);

export const restoreSessionThunk = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      return await getPerfilService();
    } catch {
      localStorage.removeItem("token");
      return rejectWithValue("Sesión expirada");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>,
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    setIsRestoring: (state, action: PayloadAction<boolean>) => {
      state.isRestoring = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isRestoring = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isRestoring = false;
      })
      .addCase(restoreSessionThunk.pending, (state) => {
        state.isRestoring = true;
      })
      .addCase(restoreSessionThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isRestoring = false;
      })
      .addCase(restoreSessionThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isRestoring = false;
      });
  },
});

export const { setCredentials, logout, setIsRestoring } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser as apiRegisterUser,
  fetchOwnProfile,
} from "../../utils/api";

// Register user dan auto-login
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }) => {
    await apiRegisterUser({ name, email, password });

    const token = await loginUser({ email, password });

    // Fetch profile biar dapat data user
    const user = await fetchOwnProfile(token);

    return { user, token };
  }
);

// Login user
export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    const token = await loginUser({ email, password });

    const user = await fetchOwnProfile(token);

    return { user, token };
  }
);

// Pastikan parse aman
const storedUserRaw = localStorage.getItem("user");
let storedUser = null;

try {
  storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
} catch {
  storedUser = null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Login
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
        state.loading = false;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

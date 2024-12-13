import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { fetchProfile } from "./profileSlice";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Сохраняем токены в localStorage
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Удаляем токены из localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    updateTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Обновляем токены в localStorage
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
  },
});

export const { login, logout, updateTokens } = authSlice.actions;

export const loginAndFetchProfile =
  (credentials: { accessToken: string; refreshToken: string }) =>
  async (dispatch: AppDispatch) => {
    // Диспатчим вход
    dispatch(login(credentials));

    // После входа загружаем профиль
    await dispatch(fetchProfile());
  };

export default authSlice.reducer;

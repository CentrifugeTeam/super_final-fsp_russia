import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/shared/api/base";

interface Profile {
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  about: string;
  photo_url: string;
  is_superuser: boolean;
  representation?: {
    type: "region" | "federal";
    name?: string;
  };
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  isError: false,
};

// Асинхронный thunk для загрузки профиля
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async () => {
    const response = await api.get("/users/me");
    return response.data as Profile;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile | null>) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.profile = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;

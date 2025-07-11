import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLeaderboards as apiFetchLeaderboards } from "../../utils/api";

export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async () => {
    const leaderboard = await apiFetchLeaderboards();
    return leaderboard;
  }
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    leaderboard: [],
    loading: false, // <== TAMBAHKAN loading
    error: null, // <== Opsional: TAMBAHKAN error
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default leaderboardSlice.reducer;

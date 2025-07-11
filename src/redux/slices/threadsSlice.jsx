import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllThreads,
  fetchAllUsers,
  createThread as apiCreateThread,
  upvoteThread,
  downvoteThread,
  neutralVoteThread,
} from "../../utils/api";

export const fetchThreads = createAsyncThunk(
  "threads/fetchThreads",
  async () => {
    const threads = await fetchAllThreads();
    return threads;
  }
);

export const fetchUsers = createAsyncThunk("threads/fetchUsers", async () => {
  const users = await fetchAllUsers();
  return users;
});

export const createThread = createAsyncThunk(
  "threads/createThread",
  async ({ title, body, category }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    if (!token) throw new Error("Unauthorized: token is missing.");
    const newThread = await apiCreateThread({ title, body, category }, token);
    return newThread;
  }
);

export const voteThread = createAsyncThunk(
  "threads/voteThread",
  async ({ threadId, type }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const authUser = thunkAPI.getState().auth.user;
      const threads = thunkAPI.getState().threads.threads;

      if (!token || !authUser) {
        return thunkAPI.rejectWithValue("Unauthorized");
      }

      const thread = threads.find((t) => t.id === threadId);
      if (!thread) {
        return thunkAPI.rejectWithValue("Thread not found");
      }

      const userId = authUser.id;
      const hasUpvoted = thread.upVotesBy.includes(userId);
      const hasDownvoted = thread.downVotesBy.includes(userId);

      if (type === "upvote") {
        hasUpvoted
          ? await neutralVoteThread(threadId, token)
          : await upvoteThread(threadId, token);
      } else if (type === "downvote") {
        hasDownvoted
          ? await neutralVoteThread(threadId, token)
          : await downvoteThread(threadId, token);
      }

      const updatedThreads = await fetchAllThreads();
      return updatedThreads;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const threadsSlice = createSlice({
  name: "threads",
  initialState: {
    threads: [],
    loadingFetch: false,
    votingThreadId: null, // 👈 ditambahkan
    error: null,
  },
  reducers: {
    setThreads: (state, action) => {
      state.threads = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loadingFetch = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.threads = action.payload;
        state.loadingFetch = false;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loadingFetch = false;
        state.error = action.error.message;
      })

      .addCase(createThread.fulfilled, (state, action) => {
        state.threads.push(action.payload);
      })

      .addCase(voteThread.pending, (state, action) => {
        state.votingThreadId = action.meta.arg.threadId;
      })
      .addCase(voteThread.fulfilled, (state, action) => {
        state.threads = action.payload;
        state.votingThreadId = null;
      })
      .addCase(voteThread.rejected, (state, action) => {
        state.votingThreadId = null;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setThreads } = threadsSlice.actions;
export default threadsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchThreadDetail as apiFetchThreadDetail,
  upvoteThread as apiUpVoteThread,
  downvoteThread as apiDownVoteThread,
  neutralVoteThread as apiNeutralVoteThread,
  createComment as apiCreateComment,
} from "../../utils/api";

export const fetchThreadDetail = createAsyncThunk(
  "threadDetail/fetchThreadDetail",
  async (threadId, { rejectWithValue }) => {
    try {
      return await apiFetchThreadDetail(threadId);
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch thread detail");
    }
  }
);

export const createComment = createAsyncThunk(
  "threadDetail/createComment",
  async ({ threadId, content, token }, { rejectWithValue }) => {
    try {
      await apiCreateComment(threadId, content, token);
      return await apiFetchThreadDetail(threadId);
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to create comment");
    }
  }
);

export const upVoteThread = createAsyncThunk(
  "threadDetail/upVoteThread",
  async ({ threadId, token }, { rejectWithValue }) => {
    try {
      await apiUpVoteThread(threadId, token);
      return await apiFetchThreadDetail(threadId);
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to upvote");
    }
  }
);

export const downVoteThread = createAsyncThunk(
  "threadDetail/downVoteThread",
  async ({ threadId, token }, { rejectWithValue }) => {
    try {
      await apiDownVoteThread(threadId, token);
      return await apiFetchThreadDetail(threadId);
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to downvote");
    }
  }
);

export const neutralVoteThread = createAsyncThunk(
  "threadDetail/neutralVoteThread",
  async ({ threadId, token }, { rejectWithValue }) => {
    try {
      await apiNeutralVoteThread(threadId, token);
      return await apiFetchThreadDetail(threadId);
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to neutralize vote");
    }
  }
);

const threadDetailSlice = createSlice({
  name: "threadDetail",
  initialState: {
    thread: null,
    comments: [],
    status: "idle",
    error: null,
  },

  reducers: {
    clearThreadDetail: (state) => {
      state.thread = null;
      state.comments = [];
      state.status = "idle";
      state.error = null;
    },
    optimisticVoteUpdate: (state, action) => {
      const { userId, voteType } = action.payload;
      const { upVotesBy, downVotesBy } = state.thread;

      state.thread.upVotesBy = upVotesBy.filter((id) => id !== userId);
      state.thread.downVotesBy = downVotesBy.filter((id) => id !== userId);

      if (voteType === "up") {
        state.thread.upVotesBy.push(userId);
      } else if (voteType === "down") {
        state.thread.downVotesBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.thread = action.payload;
        state.comments = action.payload.comments || [];
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.thread = action.payload;
        state.comments = action.payload.comments || [];
      })
      .addCase(upVoteThread.fulfilled, (state, action) => {
        state.thread = action.payload;
        state.comments = action.payload.comments || [];
      })
      .addCase(downVoteThread.fulfilled, (state, action) => {
        state.thread = action.payload;
        state.comments = action.payload.comments || [];
      })
      .addCase(neutralVoteThread.fulfilled, (state, action) => {
        state.thread = action.payload;
        state.comments = action.payload.comments || [];
      });
  },
});

export const { clearThreadDetail, optimisticVoteUpdate } =
  threadDetailSlice.actions;
export default threadDetailSlice.reducer;

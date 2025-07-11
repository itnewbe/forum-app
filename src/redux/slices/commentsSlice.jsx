import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  upvoteComment,
  downvoteComment,
  neutralVoteComment,
} from "../../utils/api";
import { fetchThreadDetail } from "../slices/threadDetailSlice";

export const voteComment = createAsyncThunk(
  "comments/voteComment",
  async ({ threadId, commentId, type }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    if (!token) {
      return thunkAPI.rejectWithValue("Unauthorized: token is missing.");
    }

    try {
      if (type === "upvote") {
        await upvoteComment(threadId, commentId, token);
      } else if (type === "downvote") {
        await downvoteComment(threadId, commentId, token);
      } else if (type === "neutral") {
        await neutralVoteComment(threadId, commentId, token);
      }

      return { commentId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to vote comment"
      );
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    votingCommentIds: [],
    error: null,
    thread: null,
    comments: [],
    status: "idle",
  },
  reducers: {
    clearThreadDetail: (state) => {
      state.thread = null;
      state.comments = [];
      state.status = "idle";
      state.error = null;
      state.votingCommentIds = [];
    },

    optimisticVoteUpdate: (state, action) => {
      const { userId, voteType, commentId } = action.payload;
      const comment = state.comments.find((c) => c.id === commentId);
      if (!comment) return;

      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);

      if (voteType === "upvote") {
        comment.upVotesBy.push(userId);
      } else if (voteType === "downvote") {
        comment.downVotesBy.push(userId);
      }

      if (!state.votingCommentIds.includes(commentId)) {
        state.votingCommentIds.push(commentId);
      }
    },

    revertVoteUpdate: (state, action) => {
      const { userId, originalVoteType, commentId } = action.payload;
      const comment = state.comments.find((c) => c.id === commentId);
      if (!comment) return;

      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);

      if (originalVoteType === "upvote") {
        comment.upVotesBy.push(userId);
      } else if (originalVoteType === "downvote") {
        comment.downVotesBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ⬇️ Fetch thread detail & simpan ke state.comments
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        const thread = action.payload;
        state.thread = thread;
        state.comments = thread.comments;
        state.status = "succeeded";
        state.error = null;
      })
      // ⬇️ Update state setelah vote berhasil
      .addCase(voteComment.fulfilled, (state, action) => {
        const { commentId } = action.meta.arg;
        state.votingCommentIds = state.votingCommentIds.filter(
          (id) => id !== commentId
        );
        state.error = null;
      })
      // ⬇️ Tangani error saat voting
      .addCase(voteComment.rejected, (state, action) => {
        const { commentId } = action.meta.arg;
        state.votingCommentIds = state.votingCommentIds.filter(
          (id) => id !== commentId
        );
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearThreadDetail, optimisticVoteUpdate, revertVoteUpdate } =
  commentsSlice.actions;

export default commentsSlice.reducer;

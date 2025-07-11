import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import threadsReducer from "./slices/threadsSlice";
import loadingReducer from "./slices/loadingSlice";
import leaderboardReducer from "./slices/leaderboardSlice";
import threadDetailReducer from "./slices/threadDetailSlice";
import usersReducer from "./slices/usersSlice";
import commentsReducer from "./slices/commentsSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    loading: loadingReducer,
    leaderboard: leaderboardReducer,
    threadDetail: threadDetailReducer,
    users: usersReducer,
    comments: commentsReducer,
  },
});

import { configureStore } from "@reduxjs/toolkit";
import threadsReducer, {
  fetchThreads,
  fetchUsers,
  createThread,
  voteThread,
} from "../threadsSlice";
import * as api from "../../../utils/api";

jest.mock("../../../utils/api");

describe("threadsThunk", () => {
  it("dispatches fulfilled action after successful fetchThreads", async () => {
    const mockData = [{ id: "1", title: "Thread" }];
    api.fetchAllThreads.mockResolvedValue(mockData);

    const store = configureStore({
      reducer: {
        threads: threadsReducer,
        auth: () => ({ token: "token", user: { id: "user1" } }),
      },
    });

    await store.dispatch(fetchThreads());
    const state = store.getState();
    expect(state.threads.threads).toEqual(mockData);
  });

  it("dispatches fulfilled action after successful fetchUsers", async () => {
    const mockUsers = [{ id: "1", name: "User" }];
    api.fetchAllUsers.mockResolvedValue(mockUsers);

    const store = configureStore({
      reducer: {
        threads: threadsReducer,
        auth: () => ({ token: "token", user: { id: "user1" } }),
      },
    });

    await store.dispatch(fetchUsers());
    const state = store.getState();
    expect(state.threads.error).toBeNull();
  });

  it("dispatches fulfilled action after successful createThread", async () => {
    const newThread = { id: "2", title: "New Thread" };
    api.createThread.mockResolvedValue(newThread);

    const store = configureStore({
      reducer: {
        threads: threadsReducer,
        auth: () => ({ token: "token", user: { id: "user1" } }),
      },
    });

    await store.dispatch(
      createThread({ title: "New", body: "Body", category: "general" })
    );

    const state = store.getState();
    expect(state.threads.threads).toContainEqual(newThread);
  });

  it("rejects createThread without token", async () => {
    const store = configureStore({
      reducer: {
        threads: threadsReducer,
        auth: () => ({ token: null }),
      },
    });

    const result = await store.dispatch(
      createThread({ title: "New", body: "Body", category: "general" })
    );

    expect(result.type).toBe("threads/createThread/rejected");
  });

  it("handles voteThread with upvote", async () => {
    const updatedThreads = [{ id: "1", upVotesBy: ["user1"], downVotesBy: [] }];
    api.upvoteThread.mockResolvedValue({});
    api.fetchAllThreads.mockResolvedValue(updatedThreads);

    const store = configureStore({
      reducer: {
        threads: threadsReducer,
        auth: () => ({ token: "token", user: { id: "user1" } }),
      },
      preloadedState: {
        threads: {
          threads: [{ id: "1", upVotesBy: [], downVotesBy: [] }],
          loadingFetch: false,
          votingThreadId: null,
          error: null,
        },
      },
    });

    await store.dispatch(
      voteThread({ threadId: "1", type: "upvote" })
    );

    const state = store.getState();
    expect(state.threads.threads).toEqual(updatedThreads);
    expect(state.threads.votingThreadId).toBeNull();
  });
});

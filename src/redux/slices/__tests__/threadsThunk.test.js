import { configureStore } from "@reduxjs/toolkit";
import threadsReducer, {
  fetchThreads,
  fetchUsers,
  createThread,
  voteThread,
} from "../threadsSlice";
import * as api from "../../../utils/api";

jest.mock("../../../utils/api");

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      threads: threadsReducer,
      auth: () =>
        preloadedState.auth || {
          token: "test-token",
          user: { id: "user-1" },
        },
    },
    preloadedState,
  });

describe("threadsThunk", () => {
  it("should fetch threads successfully", async () => {
    const mockThreads = [{ id: "1", title: "Thread" }];
    api.fetchAllThreads.mockResolvedValue(mockThreads);

    const store = createTestStore();
    await store.dispatch(fetchThreads());

    const state = store.getState();
    expect(state.threads.threads).toEqual(mockThreads);
  });

  it("should fetch users successfully", async () => {
    const mockUsers = [{ id: "1", name: "Alice" }];
    api.fetchAllUsers.mockResolvedValue(mockUsers);

    const store = createTestStore();
    await store.dispatch(fetchUsers());

    expect(api.fetchAllUsers).toHaveBeenCalled();
  });

  it("should create a thread successfully with token", async () => {
    const mockThread = { id: "2", title: "New Thread" };
    api.createThread.mockResolvedValue(mockThread); // ✅ gunakan nama yang di-mock, bukan alias

    const store = createTestStore({
      auth: { token: "test-token" },
    });

    const result = await store.dispatch(
      createThread({ title: "New", body: "Body", category: "general" })
    );

    const state = store.getState();
    expect(result.type).toBe("threads/createThread/fulfilled");
    expect(state.threads.threads).toContainEqual(mockThread);
  });

  it("should reject createThread without token", async () => {
    const store = createTestStore({
      auth: { token: null },
    });

    const result = await store.dispatch(
      createThread({ title: "X", body: "Y", category: "Z" })
    );

    expect(result.type).toBe("threads/createThread/rejected");
    expect(result.error.message).toMatch(/unauthorized/i);
  });

  it("should handle voteThread with upvote", async () => {
    const fakeThreads = [
      { id: "1", upVotesBy: [], downVotesBy: [], title: "Vote" },
    ];
    api.upvoteThread.mockResolvedValue({});
    api.fetchAllThreads.mockResolvedValue(fakeThreads);

    const store = createTestStore({
      auth: {
        token: "test-token",
        user: { id: "user-1" },
      },
      threads: {
        threads: fakeThreads,
      },
    });

    await store.dispatch(voteThread({ threadId: "1", type: "upvote" }));

    const state = store.getState();
    expect(state.threads.threads).toEqual(fakeThreads);
    expect(api.upvoteThread).toHaveBeenCalled();
  });

  it("should handle voteThread with downvote", async () => {
    const fakeThreads = [
      { id: "1", upVotesBy: [], downVotesBy: [], title: "Vote" },
    ];
    api.downvoteThread.mockResolvedValue({});
    api.fetchAllThreads.mockResolvedValue(fakeThreads);

    const store = createTestStore({
      auth: {
        token: "test-token",
        user: { id: "user-1" },
      },
      threads: {
        threads: fakeThreads,
      },
    });

    await store.dispatch(voteThread({ threadId: "1", type: "downvote" }));

    const state = store.getState();
    expect(state.threads.threads).toEqual(fakeThreads);
    expect(api.downvoteThread).toHaveBeenCalled();
  });
});

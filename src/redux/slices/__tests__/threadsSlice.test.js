// ✅ Test for branch protection check
import threadsReducer, { setThreads } from "../threadsSlice";

// 📝 Added for branch protection test
describe("threadsSlice reducer", () => {
  it("should handle initial state", () => {
    expect(threadsReducer(undefined, {})).toEqual({
      threads: [],
      loadingFetch: false,
      votingThreadId: null,
      error: null,
    });
  });

  it("should handle setThreads", () => {
    const newState = threadsReducer(
      undefined,
      setThreads([{ id: "1", title: "Test" }])
    );
    expect(newState.threads).toHaveLength(1);
    expect(newState.threads[0].title).toBe("Test");
  });
});

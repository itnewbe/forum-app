import threadsReducer, { setThreads } from "../threadsSlice";

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
  // ❌ Tambahkan test ini untuk sengaja gagal
  it("should fail this test intentionally", () => {
    expect(true).toBe(false); // ini akan fail
  });
});

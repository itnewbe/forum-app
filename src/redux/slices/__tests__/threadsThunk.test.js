import { configureStore } from "@reduxjs/toolkit";
import threadsReducer, { fetchThreads } from "../threadsSlice";
import * as api from "../../../utils/api";

jest.mock("../../../utils/api");
// This is a test comment for branch protection check
describe("threadsThunk", () => {
  it("dispatches fulfilled action after successful API call", async () => {
    const mockData = [{ id: "1", title: "Thread" }];
    api.fetchAllThreads.mockResolvedValue(mockData);

    const store = configureStore({
      reducer: {
        threads: threadsReducer,
      },
    });

    await store.dispatch(fetchThreads());

    const state = store.getState();

    expect(state.threads.threads).toEqual(mockData);
  });
});

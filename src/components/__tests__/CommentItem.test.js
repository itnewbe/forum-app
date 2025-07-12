import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import CommentItem from "../CommentItem";

const middlewares = [];
const mockStore = configureMockStore(middlewares);

const comment = {
  id: "comment-1",
  content: "Ini komentar.",
  createdAt: new Date().toISOString(),
  upVotesBy: [],
  downVotesBy: [],
  owner: {
    name: "Tarwin",
    avatar: "https://example.com/avatar.png",
  },
};

const initialState = {
  auth: {
    token: "token",
    user: { id: "user-1", name: "Tarwin" },
  },
  comments: {
    comments: [comment],
  },
};

describe("CommentItem", () => {
  it("renders comment content", () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <CommentItem comment={comment} threadId="thread-1" />
      </Provider>
    );

    expect(screen.getByText("Ini komentar.")).toBeInTheDocument();
    expect(screen.getByText("Tarwin")).toBeInTheDocument();
  });
});

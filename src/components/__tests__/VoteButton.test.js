import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import VoteButton from "../VoteButton";

const mockStore = configureStore([]);

describe("VoteButton", () => {
  const defaultProps = {
    upCount: 3,
    downCount: 1,
    userVote: 0,
    loading: false,
    onUpvote: jest.fn(),
    onDownvote: jest.fn(),
  };

  it("renders vote counts", () => {
    const store = mockStore({ auth: { user: { id: "user-1" } } });

    render(
      <Provider store={store}>
        <VoteButton {...defaultProps} />
      </Provider>
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls onUpvote when user is logged in and upvote button is clicked", () => {
    const store = mockStore({ auth: { user: { id: "user-1" } } });

    render(
      <Provider store={store}>
        <VoteButton {...defaultProps} />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText("Upvote"));
    expect(defaultProps.onUpvote).toHaveBeenCalled();
  });
  it("disables buttons when loading is true", () => {
    const store = mockStore({ auth: { user: { id: "user-1" } } });

    render(
      <Provider store={store}>
        <VoteButton {...defaultProps} loading={true} />
      </Provider>
    );

    expect(screen.getByLabelText("Upvote")).toBeDisabled();
    expect(screen.getByLabelText("Downvote")).toBeDisabled();
  });
});

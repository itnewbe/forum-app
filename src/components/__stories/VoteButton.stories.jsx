import React from "react";
import VoteButton from "../VoteButton";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const mockStore = configureStore({
  reducer: {
    auth: () => ({ user: { id: "user-1", name: "User Test" } }),
  },
});

export default {
  title: "Components/VoteButton",
  component: VoteButton,
};

const Template = (args) => (
  <Provider store={mockStore}>
    <VoteButton {...args} />
  </Provider>
);

export const VotedUp = Template.bind({});
VotedUp.args = {
  upCount: 10,
  downCount: 2,
  userVote: 1,
  onUpvote: () => console.log("Upvoted!"),
  onDownvote: () => console.log("Downvoted!"),
  loading: false,
};

export const VotedDown = Template.bind({});
VotedDown.args = {
  upCount: 3,
  downCount: 5,
  userVote: -1,
  onUpvote: () => console.log("Upvoted!"),
  onDownvote: () => console.log("Downvoted!"),
  loading: false,
};

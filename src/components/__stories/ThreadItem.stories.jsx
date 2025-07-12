import React from "react";
import { MemoryRouter } from "react-router-dom";
import ThreadItem from "../ThreadItem";

export default {
  title: "Components/ThreadItem",
  component: ThreadItem,
};

const thread = {
  id: "thread-1",
  title: "Judul Thread",
  body: "<p>Isi thread dengan HTML</p>",
  category: "react",
  createdAt: new Date().toISOString(),
  ownerId: "user-1",
  totalComments: 2,
};

// Ganti avatar dengan ui-avatars agar aman dan tidak error
const users = [
  {
    id: "user-1",
    name: "User Test",
    avatar: "https://ui-avatars.com/api/?name=User+Test&background=random",
  },
];

const Template = (args) => (
  <MemoryRouter>
    <ThreadItem {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  thread,
  onVote: () => {
    console.log("Vote clicked");
  },
  votes: { upCount: 3, downCount: 1, userVote: 1 },
  users,
};

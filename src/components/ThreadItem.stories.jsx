import React from "react";
import ThreadItem from "./ThreadItem";

export default {
  title: "Forum/ThreadItem",
  component: ThreadItem,
};

const Template = (args) => <ThreadItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  thread: {
    id: "thread-1",
    title: "Apa itu React?",
    body: "<p>React adalah library JavaScript untuk membangun UI.</p>",
    category: "frontend",
    createdAt: "2025-07-10T08:00:00.000Z",
    ownerId: "user-1",
    totalComments: 12,
  },
  votes: {
    upCount: 10,
    downCount: 2,
    userVote: 1,
  },
  onVote: (id, type) => console.log(`Voted ${type} on ${id}`),
  users: [
    {
      id: "user-1",
      name: "Bella",
      avatar: "https://ui-avatars.com/api/?name=Bella",
    },
  ],
};

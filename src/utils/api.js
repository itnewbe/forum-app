const BASE_URL = "https://forum-api.dicoding.dev/v1";

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const json = await res.json();
  return json;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  return json.data.token;
};

export const fetchAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  const json = await res.json();
  return json.data.users;
};

export const fetchOwnProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  return json.data.user;
};

export const createThread = async ({ title, body, category }, token) => {
  const res = await fetch(`${BASE_URL}/threads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, category }),
  });
  const json = await res.json();
  return json.data.thread;
};

export const fetchAllThreads = async () => {
  const res = await fetch(`${BASE_URL}/threads`);
  const json = await res.json();
  return json.data.threads;
};

export const fetchThreadDetail = async (threadId) => {
  const res = await fetch(`${BASE_URL}/threads/${threadId}`);
  const json = await res.json();
  return json.data.detailThread;
};

export const createComment = async (threadId, content, token) => {
  const res = await fetch(`${BASE_URL}/threads/${threadId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  const json = await res.json();
  return json.data.comment;
};

export const upvoteThread = async (threadId, token) => {
  const res = await fetch(`${BASE_URL}/threads/${threadId}/up-vote`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  return json.data.vote;
};

export const downvoteThread = async (threadId, token) => {
  const res = await fetch(`${BASE_URL}/threads/${threadId}/down-vote`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  return json.data.vote;
};

export const neutralVoteThread = async (threadId, token) => {
  const res = await fetch(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  return json.data.vote;
};

export const upvoteComment = async (threadId, commentId, token) => {
  const res = await fetch(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  return json.data.vote;
};

export const downvoteComment = async (threadId, commentId, token) => {
  const res = await fetch(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  return json.data.vote;
};

export const neutralVoteComment = async (threadId, commentId, token) => {
  const res = await fetch(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  return json.data.vote;
};

export const fetchLeaderboards = async () => {
  const res = await fetch(`${BASE_URL}/leaderboards`);
  const json = await res.json();
  return json.data.leaderboards;
};

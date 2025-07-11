import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchThreads, voteThread } from "../redux/slices/threadsSlice";
import { fetchUsers } from "../redux/slices/usersSlice";
import ThreadItem from "../components/ThreadItem";

const ThreadList = () => {
  const dispatch = useDispatch();

  const {
    threads = [],
    loadingFetch: loading,
    error,
  } = useSelector((state) => state.threads);

  const { users = [] } = useSelector((state) => state.users);
  const { token, user: authUser } = useSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    dispatch(fetchThreads());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    let timer;

    if (loading) {
      setProgress(true);
    } else {
      timer = setTimeout(() => {
        setProgress(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  const handleVote = (threadId, type) => {
    if (!token) {
      alert("Silakan login dulu untuk voting.");
      return;
    }

    dispatch(voteThread({ threadId, type }));
  };

  const categories = useMemo(() => {
    const unique = new Set();
    threads.forEach((t) => {
      if (t.category) unique.add(t.category);
    });
    return ["all", ...unique];
  }, [threads]);

  const filteredThreads =
    selectedCategory === "all"
      ? threads
      : threads.filter((t) => t.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16 grid gap-6 animate-slideUp">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full border text-sm transition ${
              selectedCategory === category
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {category === "all" ? "Semua Kategori" : category}
          </button>
        ))}
      </div>

      {progress && (
        <>
          <div className="w-full h-1 bg-gray-200 mb-2 overflow-hidden rounded">
            <div
              className={`h-full bg-blue-500 transition-all duration-[1500ms] ease-linear ${
                progress ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mb-2">Memuat data ...</div>
        </>
      )}

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      {!progress && filteredThreads.length === 0 && (
        <div className="text-gray-500 text-sm">
          Tidak ada thread pada kategori ini.
        </div>
      )}

      {filteredThreads.map((thread) => {
        const userId = authUser?.id;
        const userVote = userId
          ? thread.upVotesBy.includes(userId)
            ? 1
            : thread.downVotesBy.includes(userId)
            ? -1
            : 0
          : 0;

        return (
          <ThreadItem
            key={thread.id}
            thread={thread}
            votes={{
              upCount: thread.upVotesBy.length,
              downCount: thread.downVotesBy.length,
              userVote: userVote,
            }}
            onVote={handleVote}
            loading={loading}
            users={users}
          />
        );
      })}
    </div>
  );
};

export default ThreadList;

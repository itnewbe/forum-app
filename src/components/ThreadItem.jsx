import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import VoteButton from "./VoteButton";

const calculateDaysAgo = (date) => {
  const createdAt = new Date(date);
  const diffTime = Date.now() - createdAt.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const ThreadItem = ({
  thread,
  votes = { upCount: 0, downCount: 0, userVote: 0 },
  onVote,
  users = [],
}) => {
  const daysAgo = calculateDaysAgo(thread.createdAt);
  const owner = users.find((u) => u.id === thread.ownerId);

  const [localVotes, setLocalVotes] = useState(votes);

  useEffect(() => {
    setLocalVotes(votes);
  }, [votes]);

  const handleVote = (type) => {
    const { userVote, upCount, downCount } = localVotes;
    let newVote = 0;
    let newUp = upCount;
    let newDown = downCount;

    if (type === "upvote") {
      if (userVote === 1) {
        newVote = 0;
        newUp -= 1;
      } else {
        newVote = 1;
        newUp += 1;
        if (userVote === -1) newDown -= 1;
      }
    } else if (type === "downvote") {
      if (userVote === -1) {
        newVote = 0;
        newDown -= 1;
      } else {
        newVote = -1;
        newDown += 1;
        if (userVote === 1) newUp -= 1;
      }
    }

    // ⛑ Ensure votes never go below 0
    newUp = Math.max(0, newUp);
    newDown = Math.max(0, newDown);

    setLocalVotes({
      upCount: newUp,
      downCount: newDown,
      userVote: newVote,
    });

    onVote(thread.id, type);
  };

  return (
    <article className="bg-white/90 backdrop-blur-sm text-black rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      {thread.category && (
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
            #{thread.category}
          </span>
        </div>
      )}

      <h2 className="text-xl font-semibold text-purple-800 mb-2">
        <Link to={`/threads/${thread.id}`} className="hover:underline">
          {thread.title}
        </Link>
      </h2>

      <div
        className="prose prose-sm max-w-none text-gray-800 mb-4"
        dangerouslySetInnerHTML={{ __html: thread.body }}
      />

      <footer className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mt-4 border-t pt-4">
        <VoteButton
          upCount={localVotes.upCount}
          downCount={localVotes.downCount}
          userVote={localVotes.userVote}
          onUpvote={() => handleVote("upvote")}
          onDownvote={() => handleVote("downvote")}
        />

        <div className="flex items-center gap-1">
          <MessageCircle size={16} />
          <span>{thread.totalComments ?? 0}</span>
        </div>

        <span>{daysAgo} hari lalu</span>

        <div className="flex items-center gap-2">
          {owner?.avatar && (
            <img
              src={owner.avatar}
              alt={owner.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span>
            Dibuat oleh{" "}
            <strong>{owner?.name || "Pengguna Tidak Diketahui"}</strong>
          </span>
        </div>
      </footer>
    </article>
  );
};

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    totalComments: PropTypes.number,
  }).isRequired,
  votes: PropTypes.shape({
    upCount: PropTypes.number,
    downCount: PropTypes.number,
    userVote: PropTypes.number,
  }),
  onVote: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatar: PropTypes.string,
    })
  ),
};

export default ThreadItem;

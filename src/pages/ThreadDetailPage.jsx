import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchThreadDetail,
  upVoteThread,
  downVoteThread,
  createComment,
  neutralVoteThread,
  optimisticVoteUpdate,
} from "../redux/slices/threadDetailSlice";
import { useParams } from "react-router-dom";
import CommentItem from "../components/CommentItem";
import VoteButton from "../components/VoteButton";

export default function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { thread, comments, status, error } = useSelector(
    (state) => state.threadDetail
  );
  const token = useSelector((state) => state.auth.token);
  const authUser = useSelector((state) => state.auth.user?.id);

  const [commentText, setCommentText] = useState("");

  const refreshData = () => dispatch(fetchThreadDetail(id));

  useEffect(() => {
    if (id) {
      dispatch(fetchThreadDetail(id));
    }
  }, [dispatch, id]);

  if (status === "loading")
    return <p className="text-center mt-10">Loading thread details...</p>;
  if (status === "failed")
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!thread) return <p className="text-center mt-10">Thread not found.</p>;

  const daysAgo = Math.floor(
    (Date.now() - new Date(thread.createdAt)) / (1000 * 60 * 60 * 24)
  );

  const isUpVoted = thread.upVotesBy.includes(authUser);
  const isDownVoted = thread.downVotesBy.includes(authUser);

  const handleUpVote = async () => {
    dispatch(
      optimisticVoteUpdate({
        userId: authUser,
        voteType: isUpVoted ? "neutral" : "up",
      })
    );

    if (isUpVoted) {
      await dispatch(neutralVoteThread({ threadId: thread.id, token }));
    } else {
      await dispatch(upVoteThread({ threadId: thread.id, token }));
    }
  };

  const handleDownVote = async () => {
    dispatch(
      optimisticVoteUpdate({
        userId: authUser,
        voteType: isDownVoted ? "neutral" : "down",
      })
    );

    if (isDownVoted) {
      await dispatch(neutralVoteThread({ threadId: thread.id, token }));
    } else {
      await dispatch(downVoteThread({ threadId: thread.id, token }));
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    await dispatch(
      createComment({
        threadId: thread.id,
        content: commentText,
        token,
      })
    );
    setCommentText("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <span className="inline-block bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded mb-2">
        #{thread.category}
      </span>

      <h1 className="text-2xl font-semibold mb-4">{thread.title}</h1>

      <div
        className="prose mb-4"
        dangerouslySetInnerHTML={{ __html: thread.body }}
      />

      <div className="flex items-center text-sm text-gray-600 mb-4 space-x-2">
        <VoteButton
          upCount={thread.upVotesBy.length}
          downCount={thread.downVotesBy.length}
          onUpvote={handleUpVote}
          onDownvote={handleDownVote}
          userVote={isUpVoted ? 1 : isDownVoted ? -1 : 0}
          loading={status === "loading"}
        />

        <span>•</span>
        <div className="flex items-center space-x-2">
          <img
            src={thread.owner?.avatar}
            alt={thread.owner?.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span>
            Dibuat oleh <strong>{thread.owner?.name || "Unknown"}</strong>
          </span>
        </div>

        <span>•</span>
        <span>{daysAgo} hari lalu</span>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Beri komentar</h2>
        <textarea
          className="w-full border border-gray-300 p-2 rounded"
          rows="3"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Tulis komentar..."
        />
        <button
          className="mt-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          onClick={handleSendComment}
        >
          Kirim
        </button>
      </div>

      <h3 className="text-md font-semibold mb-2">
        Komentar ({comments?.length || 0})
      </h3>
      {comments?.length === 0 ? (
        <p className="text-gray-500">Belum ada komentar.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              threadId={thread.id}
              token={token}
              currentUserId={authUser}
              onVoteChange={refreshData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

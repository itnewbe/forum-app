import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  voteComment,
  optimisticVoteUpdate,
  revertVoteUpdate,
} from "../redux/slices/commentsSlice";
import VoteButton from "./VoteButton";

export default function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.comments);

  const currentUserId = user?.id;
  const updatedComment = comments.find((c) => c.id === comment.id) || comment;

  const upVoted = updatedComment.upVotesBy?.includes(currentUserId);
  const downVoted = updatedComment.downVotesBy?.includes(currentUserId);

  const createdAt = new Date(updatedComment.createdAt);
  const diffDays = Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24));
  const formattedTime = diffDays === 0 ? "Hari ini" : `${diffDays} hari lalu`;

  const ownerName = updatedComment.owner?.name || "Unknown";
  const avatar = updatedComment.owner?.avatar || "/default-avatar.png";

  const handleVote = (type) => {
    if (!token || !currentUserId) return;

    let voteType = "neutral";
    let originalVoteType = null;

    if (type === "up") {
      originalVoteType = upVoted
        ? "upvote"
        : downVoted
        ? "downvote"
        : "neutral";
      voteType = upVoted ? "neutral" : "upvote";
    } else if (type === "down") {
      originalVoteType = downVoted
        ? "downvote"
        : upVoted
        ? "upvote"
        : "neutral";
      voteType = downVoted ? "neutral" : "downvote";
    }

    // 1. Optimistic update (langsung ubah UI)
    dispatch(
      optimisticVoteUpdate({
        userId: currentUserId,
        voteType,
        commentId: updatedComment.id,
      })
    );

    // 2. Dispatch API call (bisa gagal → revert)
    dispatch(
      voteComment({ threadId, commentId: updatedComment.id, type: voteType })
    )
      .unwrap()
      .catch(() => {
        dispatch(
          revertVoteUpdate({
            userId: currentUserId,
            originalVoteType,
            commentId: updatedComment.id,
          })
        );
        alert("Vote gagal. Coba lagi.");
      });
  };

  return (
    <div className="border-b border-gray-200 pb-3">
      <div className="flex items-center space-x-3 mb-1">
        <img
          src={avatar}
          alt={ownerName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-medium">{ownerName}</span>
        <span className="text-gray-500 text-sm">{formattedTime}</span>
      </div>

      <p className="mb-2">{updatedComment.content}</p>

      <VoteButton
        upCount={updatedComment.upVotesBy?.length || 0}
        downCount={updatedComment.downVotesBy?.length || 0}
        onUpvote={() => handleVote("up")}
        onDownvote={() => handleVote("down")}
        userVote={upVoted ? 1 : downVoted ? -1 : 0}
      />
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
    owner: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

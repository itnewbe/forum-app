import React from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function VoteButton({
  upCount,
  downCount,
  onUpvote,
  onDownvote,
  userVote,
  loading,
}) {
  const { user } = useSelector((state) => state.auth);

  const handleUpvote = () => {
    if (!user) {
      Swal.fire({
        title: "Kamu belum login",
        text: "Silakan login terlebih dahulu untuk vote.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    onUpvote();
  };

  const handleDownvote = () => {
    if (!user) {
      Swal.fire({
        title: "Kamu belum login",
        text: "Silakan login terlebih dahulu untuk vote.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    onDownvote();
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleUpvote}
        disabled={loading}
        className="flex items-center gap-1"
        aria-label="Upvote"
      >
        <ThumbsUp
          className={`w-6 h-6 transition-colors duration-150 ${
            userVote === 1 ? "text-green-600 fill-green-600" : "text-gray-500"
          }`}
          fill={userVote === 1 ? "currentColor" : "none"}
        />
        <span className={userVote === 1 ? "text-green-600 font-bold" : ""}>
          {upCount}
        </span>
      </button>

      <button
        onClick={handleDownvote}
        className="flex items-center gap-1"
        aria-label="Downvote"
        disabled={loading}
      >
        <ThumbsDown
          className={`w-6 h-6 transition-colors duration-150 ${
            userVote === -1 ? "text-red-600 fill-red-600" : "text-gray-500"
          }`}
          fill={userVote === -1 ? "currentColor" : "none"}
        />
        <span className={userVote === -1 ? "text-red-600 font-bold" : ""}>
          {downCount}
        </span>
      </button>
    </div>
  );
}

VoteButton.propTypes = {
  upCount: PropTypes.number.isRequired,
  downCount: PropTypes.number.isRequired,
  onUpvote: PropTypes.func.isRequired,
  onDownvote: PropTypes.func.isRequired,
  userVote: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

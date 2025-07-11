import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../redux/slices/leaderboardSlice";

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const { leaderboard, loading, error } = useSelector(
    (state) => state.leaderboard
  );

  const [progress, setProgress] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      setProgress(false);
      const timer = setTimeout(() => setProgress(true), 50);
      return () => clearTimeout(timer);
    } else {
      setProgress(false);
    }
  }, [loading]);

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  };

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-400",
    "bg-yellow-300",
    "bg-lime-400",
    "bg-green-400",
    "bg-teal-500",
    "bg-sky-500",
    "bg-indigo-400",
    "bg-purple-400",
    "bg-pink-400",
  ];

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Klasmen Pengguna Aktif
      </h2>

      {loading && (
        <>
          <div className="w-full h-1 bg-gray-200 mb-2 overflow-hidden rounded">
            <div
              className={`h-full bg-blue-500 transition-all duration-[1500ms] ease-linear ${
                progress ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            Memuat data leaderboards...
          </div>
        </>
      )}

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <div className="flex justify-between font-semibold px-4 py-2 border-b">
        <span>Pengguna</span>
        <span>Skor</span>
      </div>

      <ul className="divide-y">
        {[...leaderboard]
          .sort((a, b) => b.score - a.score)
          .map((entry, index) => {
            const color = colors[index % colors.length];
            return (
              <li
                key={entry.user.id}
                className="flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500 w-5 text-sm">
                    {index + 1}.
                  </span>

                  {entry.user.avatar ? (
                    <img
                      src={entry.user.avatar}
                      alt={entry.user.name || "Unknown"}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-full ${color} text-white flex items-center justify-center font-bold uppercase`}
                    >
                      {getInitials(entry.user.name)}
                    </div>
                  )}

                  <span className="text-gray-800">
                    {entry.user.name || "Unknown"}
                  </span>
                </div>
                <span className="font-semibold">{entry.score}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

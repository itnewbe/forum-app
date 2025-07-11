import React from "react";
import ThreadList from "../containers/ThreadList";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">
      {/* Hero */}
      <header className="text-center py-16 px-4 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to the Community Forum
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Share your thoughts, ask questions, and connect with other members.
        </p>
      </header>

      {/* Threads */}
      <main className="max-w-6xl mx-auto px-4 pb-16 animate-slideUp">
        <ThreadList />
      </main>
    </div>
  );
};

export default HomePage;

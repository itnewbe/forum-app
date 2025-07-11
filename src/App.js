import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateThreadPage from "./pages/CreateThreadPage";
import ThreadDetailPage from "./pages/ThreadDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NavigationBar from "./components/NavigationBar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <NavigationBar />

      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/" replace />}
        />

        <Route path="/" element={<HomePage />} />
        <Route path="/threads/:id" element={<ThreadDetailPage />} />
        <Route path="/leaderboards" element={<LeaderboardPage />} />

        <Route
          path="/create-thread"
          element={
            <ProtectedRoute>
              <CreateThreadPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

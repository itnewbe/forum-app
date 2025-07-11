import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createThread } from "../redux/slices/threadsSlice";
import { useNavigate } from "react-router-dom";

export default function CreateThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", body: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = useSelector((state) => state.auth.token);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token) {
      setError("You must be logged in to create a thread.");
      setLoading(false);
      return;
    }

    dispatch(createThread(form))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create New Thread</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Thread Title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
        />
        <textarea
          name="body"
          placeholder="Thread Content"
          value={form.body}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {loading ? "Creating..." : "Create Thread"}
        </button>
      </form>
    </div>
  );
}

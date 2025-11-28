import React, { useState } from "react";
import API from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Auth({ onAuth }) {
  const [params] = useSearchParams();
  const defaultMode = params.get("mode") || "login";
  const [isSignup, setIsSignup] = useState(defaultMode === "signup");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const path = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup
        ? form
        : { email: form.email, password: form.password };

      const { data } = await API.post(path, payload);

      onAuth(data.user, data.token);
    } catch {
      alert("Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 bg-gradient-to-b from-white to-indigo-100">
      {/* TOP NAV */}
      <header className="py-6 px-6 text-xl font-bold text-gray-900">
        Minimal Auction
      </header>

      {/* MAIN FORM CENTER */}
      <div className="flex flex-col justify-center items-center flex-1">
        <form
          onSubmit={submit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-center text-indigo-600">
            {isSignup ? "Sign Up" : "Log In"}
          </h2>

          <p className="text-center text-gray-500 text-sm">
            {isSignup
              ? "Please register to continue"
              : "Please login to continue"}
          </p>

          {isSignup && (
            <div className="relative">
              <input
                type="text"
                placeholder="Name"
                required
                className="input rounded-full pl-10"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">👤</span>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              placeholder="Email ID"
              required
              className="input rounded-full pl-10"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">📧</span>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              required
              className="input rounded-full pl-10"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔑</span>
          </div>

          <p className="text-xs text-gray-500 cursor-pointer hover:underline text-right">
            Forgot Password?
          </p>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-full font-medium shadow-lg hover:shadow-indigo-300 transition"
          >
            {isSignup ? "Signup" : "Login"}
          </button>

          <p className="text-center text-sm text-gray-500">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setIsSignup(false);
                    navigate("/auth?mode=login");
                  }}
                  className="text-indigo-600 cursor-pointer hover:underline"
                >
                  Click Here
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => {
                    setIsSignup(true);
                    navigate("/auth?mode=signup");
                  }}
                  className="text-indigo-600 cursor-pointer hover:underline"
                >
                  Click Here
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

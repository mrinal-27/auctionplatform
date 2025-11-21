import React, { useState } from 'react';
import API from '../api';
import { useSearchParams } from "react-router-dom";

export default function Auth({ onAuth }) {
  const [params] = useSearchParams();
  const defaultMode = params.get("mode") || "login";
  const [isSignup, setIsSignup] = useState(defaultMode === "signup");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  // handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
  e.preventDefault();
  try {
    const path = isSignup ? "/auth/signup" : "/auth/login";
    const payload = isSignup
      ? { name: form.name, email: form.email, password: form.password }
      : { email: form.email, password: form.password };

    const { data } = await API.post(path, payload);

    onAuth(data.user, data.token);
  } catch (err) {
    alert(err.response?.data?.message || "Authentication error");
  }
};


  return (
    <div className="auth-root">
      <div className="auth-card">

        <h1 className="brand">{isSignup ? "Create Account" : "Welcome Back"}</h1>
        <p className="muted">
          {isSignup ? "Join the auction platform" : "Login to continue"}
        </p>

        <form onSubmit={submit} className="auth-form" autoComplete="off">

  {isSignup && (
    <input
      name="name"
      placeholder="Name"
      required
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
    />
  )}

  <input
    name="email"
    type="email"
    placeholder="Email"
    required
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
  />

  <input
    name="password"
    type="password"
    placeholder="Password"
    required
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
  />

  <button type="submit" className="primary">
    {isSignup ? "Sign Up" : "Login"}
  </button>
</form>


      </div>
    </div>
  );
}

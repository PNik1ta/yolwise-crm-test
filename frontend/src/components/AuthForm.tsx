"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "../lib/api";

type Mode = "login" | "register";

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setError(null);
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const path = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const { status, data } = await apiFetch(path, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        ...(mode === "register" ? { fullName } : {}),
      }),
    });

    setLoading(false);

    if (status === 200 || status === 201) {
      onSuccess();
      return;
    }

    const message =
      (typeof data === "object" &&
        data &&
        "message" in data &&
        data.message) ||
      "Something went wrong";

    setError(String(message));
  };

  return (
    <>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <button type="button" className="mode-toggle" onClick={toggleMode}>
        {mode === "login"
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {mode === "register" && (
          <label className="form-field">
            <span>Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
        )}

        <label className="form-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Register"}
        </button>
      </form>
    </>
  );
}

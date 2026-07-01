"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as api from "../lib/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.signup(name, email, password);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <a href="/" className="font-display font-bold text-lg block mb-8 text-center">
          PayFlow
        </a>

        <div className="bg-[var(--panel)] border border-[var(--panel-light)] rounded-xl p-8">
          <h1 className="font-display font-bold text-2xl mb-1">Create an account</h1>
          <p className="text-[var(--mist)] text-sm mb-6">
            Get a wallet in seconds.
          </p>

          {error && (
            <div className="bg-[var(--coral)]/10 border border-[var(--coral)]/30 text-[var(--coral)] text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-[var(--mist)] block mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--panel-light)] rounded-lg px-4 py-2.5 text-[var(--paper)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--mist)] block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--panel-light)] rounded-lg px-4 py-2.5 text-[var(--paper)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--mist)] block mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--panel-light)] rounded-lg px-4 py-2.5 text-[var(--paper)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[var(--flow)] text-white rounded-lg py-2.5 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-[var(--mist)] text-center mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-[var(--flow)]">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
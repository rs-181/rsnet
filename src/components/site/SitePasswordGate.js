"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SitePasswordGate({ siteId, siteName }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Incorrect password.");
        return;
      }
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-950 px-6 text-white">
      <div className="card w-full max-w-sm p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-charcoal-800 text-xl">
          🔒
        </div>
        <h1 className="mb-1 font-display text-xl font-bold">{siteName} is locked</h1>
        <p className="mb-6 text-sm text-charcoal-600">
          Enter the password to view this site.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Password"
            autoFocus
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

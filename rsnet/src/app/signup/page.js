"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError("Couldn't create that account. The email may already be in use.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace("/dashboard");
    } catch (err) {
      setError("Couldn't sign up with Google.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-sm animate-scale-in p-8">
        <h1 className="mb-1 font-display text-2xl font-bold">Create your account</h1>
        <p className="mb-6 text-sm text-charcoal-600">
          Free forever. No credit card needed.
        </p>

        <GoogleSignInButton
          onClick={handleGoogle}
          disabled={googleSubmitting}
          label="Sign up with Google"
        />

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-charcoal-700" />
          <span className="text-xs text-charcoal-600">or</span>
          <div className="h-px flex-1 bg-charcoal-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating account…" : "Sign up free"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-600">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

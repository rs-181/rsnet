"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

// Keeps the server-side session cookie (used by the ghost admin panel and
// server-side site creation) in sync with whatever Firebase Auth's client
// SDK currently thinks the auth state is — regardless of whether that
// state came from email/password or Google sign-in.
async function syncServerSession(firebaseUser) {
  try {
    if (firebaseUser) {
      const idToken = await firebaseUser.getIdToken();
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    } else {
      await fetch("/api/session", { method: "DELETE" });
    }
  } catch {
    // Non-fatal — worst case the admin panel / server-side site creation
    // won't recognize this session until the next successful sync.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      syncServerSession(firebaseUser);
    });
    return unsubscribe;
  }, []);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

  const logout = async () => {
    await signOut(auth);
    await syncServerSession(null);
  };

  const value = { user, loading, signup, login, loginWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

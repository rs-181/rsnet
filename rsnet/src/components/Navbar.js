"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="border-b border-charcoal-700 bg-charcoal-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-display text-lg font-bold tracking-tight">
          RS <span className="text-gold-500">Net</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-charcoal-600 sm:inline">
            {user?.email}
          </span>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

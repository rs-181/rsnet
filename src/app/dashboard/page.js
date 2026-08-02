"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SiteCard from "@/components/SiteCard";
import EmptyState from "@/components/EmptyState";
import SiteSettingsModal from "@/components/SiteSettingsModal";
import { slugify } from "@/lib/blockTypes";

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [sites, setSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [creating, setCreating] = useState(false);
  const [settingsSite, setSettingsSite] = useState(null);

  const loadSites = async () => {
    setLoadingSites(true);
    const q = query(collection(db, "sites"), where("ownerId", "==", user.uid));
    const snapshot = await getDocs(q);
    setSites(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoadingSites(false);
  };

  useEffect(() => {
    if (user) loadSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreate = async () => {
    const name = window.prompt("Name your new site:");
    if (!name || !name.trim()) return;

    setCreating(true);
    try {
      await addDoc(collection(db, "sites"), {
        name: name.trim(),
        subdomain: `${slugify(name)}-${user.uid.slice(0, 5)}`,
        ownerId: user.uid,
        isPasswordProtected: false,
        isSuspended: false,
        pages: [{ id: "home", name: "Home", slug: "home", blocks: [] }],
        createdAt: serverTimestamp(),
      });
      await loadSites();
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (site) => {
    router.push(`/dashboard/builder/${site.id}`);
  };

  const handleDelete = async (site) => {
    const confirmed = window.confirm(`Delete "${site.name}"? This can't be undone.`);
    if (!confirmed) return;
    await deleteDoc(doc(db, "sites", site.id));
    setSites((prev) => prev.filter((s) => s.id !== site.id));
  };

  const handleSettingsUpdated = (updatedSite) => {
    setSites((prev) => prev.map((s) => (s.id === updatedSite.id ? updatedSite : s)));
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">Your sites</h1>
            <p className="text-sm text-charcoal-600">
              {sites.length} {sites.length === 1 ? "site" : "sites"}
            </p>
          </div>
          {sites.length > 0 && (
            <button onClick={handleCreate} disabled={creating} className="btn-primary">
              {creating ? "Creating…" : "+ New site"}
            </button>
          )}
        </div>

        {loadingSites ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal-600 border-t-gold-500" />
          </div>
        ) : sites.length === 0 ? (
          <div className="animate-fade-slide-up">
            <EmptyState onCreate={handleCreate} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site, i) => (
              <div
                key={site.id}
                className="h-full animate-fade-slide-up"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                <SiteCard
                  site={site}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSettings={setSettingsSite}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {settingsSite && (
        <SiteSettingsModal
          site={settingsSite}
          onClose={() => setSettingsSite(null)}
          onUpdated={handleSettingsUpdated}
        />
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

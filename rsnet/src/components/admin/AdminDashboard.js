"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSiteEditModal from "./AdminSiteEditModal";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://getrs.vercel.app";

export default function AdminDashboard() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSite, setEditingSite] = useState(null);
  const [busySiteId, setBusySiteId] = useState(null);

  const loadSites = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/sites");
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Couldn't load sites.");
        return;
      }
      setSites(data.sites);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  const patchSite = async (siteId, updates) => {
    const res = await fetch(`/api/admin/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Update failed.");
    setSites((prev) => prev.map((s) => (s.id === siteId ? { ...s, ...updates } : s)));
  };

  const handleToggleSuspend = async (site) => {
    setBusySiteId(site.id);
    try {
      await patchSite(site.id, { isSuspended: !site.isSuspended });
    } finally {
      setBusySiteId(null);
    }
  };

  const handleDelete = async (site) => {
    const confirmed = window.confirm(
      `Permanently delete "${site.name}" (${SITE_ORIGIN}/sites/${site.sitename})? This can't be undone.`
    );
    if (!confirmed) return;

    setBusySiteId(site.id);
    try {
      const res = await fetch(`/api/admin/sites/${site.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setSites((prev) => prev.filter((s) => s.id !== site.id));
    } finally {
      setBusySiteId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-charcoal-700 bg-charcoal-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg font-bold">
            RS Net <span className="text-gold-500">Admin</span>
          </span>
          <Link href="/dashboard" className="btn-secondary text-sm">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold">All sites</h1>
          <p className="text-sm text-charcoal-600">
            {sites.length} {sites.length === 1 ? "site" : "sites"}
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal-600 border-t-gold-500" />
          </div>
        ) : sites.length === 0 ? (
          <p className="card p-8 text-center text-sm text-charcoal-600">No sites on the platform yet.</p>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-charcoal-700 text-xs uppercase tracking-wider text-charcoal-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Site</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Pages</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id} className="border-b border-charcoal-700 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{site.name}</p>
                      <a
                        href={`${SITE_ORIGIN}/sites/${site.sitename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-electric-400 hover:underline"
                      >
                        /sites/{site.sitename}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal-600">{site.ownerId}</td>
                    <td className="px-4 py-3">{site.pageCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {site.isSuspended && (
                          <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-xs text-red-400">
                            Suspended
                          </span>
                        )}
                        {site.isPasswordProtected && (
                          <span className="rounded-full bg-charcoal-800 px-2 py-0.5 text-xs text-gold-500">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setEditingSite(site)}
                          disabled={busySiteId === site.id}
                          className="btn-secondary px-3 py-1.5 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleSuspend(site)}
                          disabled={busySiteId === site.id}
                          className="btn-secondary px-3 py-1.5 text-xs"
                        >
                          {site.isSuspended ? "Unsuspend" : "Suspend"}
                        </button>
                        <button
                          onClick={() => handleDelete(site)}
                          disabled={busySiteId === site.id}
                          className="btn-secondary px-3 py-1.5 text-xs text-red-400 hover:border-red-400 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {editingSite && (
        <AdminSiteEditModal
          site={editingSite}
          onClose={() => setEditingSite(null)}
          onSave={patchSite}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function AdminSiteEditModal({ site, onClose, onSave }) {
  const [name, setName] = useState(site.name);
  const [sitename, setSitename] = useState(site.sitename);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (!name.trim() || !sitename.trim()) {
      setError("Name and URL can't be empty.");
      return;
    }
    setSaving(true);
    try {
      await onSave(site.id, { name: name.trim(), sitename: sitename.trim() });
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 px-4 animate-fade-in"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="card w-full max-w-sm animate-scale-in p-6">
        <h2 className="mb-4 font-display text-lg font-bold">Edit site</h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">Site name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">URL</label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-sm text-charcoal-600">/sites/</span>
              <input
                className="input"
                value={sitename}
                onChange={(e) => setSitename(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-charcoal-600">
              Changing this doesn't check for collisions with another site's URL —
              double-check it's free before saving.
            </p>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-sm">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SiteSettingsModal({ site, onClose, onUpdated }) {
  const [protectedEnabled, setProtectedEnabled] = useState(!!site.isPasswordProtected);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");

    const settingNewPassword = protectedEnabled && (password.length > 0 || !site.isPasswordProtected);
    if (settingNewPassword) {
      if (password.length < 4) {
        setError("Password must be at least 4 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords don't match.");
        return;
      }
    }

    setSaving(true);
    try {
      const updates = { isPasswordProtected: protectedEnabled };
      if (protectedEnabled) {
        if (password.length > 0) {
          updates.passwordHash = await bcrypt.hash(password, 10);
        }
      } else {
        updates.passwordHash = null;
      }
      await updateDoc(doc(db, "sites", site.id), updates);
      onUpdated({ ...site, ...updates });
      onClose();
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
        <h2 className="mb-1 font-display text-lg font-bold">Site settings</h2>
        <p className="mb-5 text-sm text-charcoal-600">{site.name}</p>

        <label className="mb-4 flex items-center justify-between rounded-xl border border-charcoal-700 bg-charcoal-800 px-4 py-3 text-sm">
          Password protect this site
          <input
            type="checkbox"
            checked={protectedEnabled}
            onChange={(e) => setProtectedEnabled(e.target.checked)}
            className="h-4 w-4 accent-gold-500"
          />
        </label>

        {protectedEnabled && (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">
                {site.isPasswordProtected
                  ? "New password (leave blank to keep current)"
                  : "Password"}
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Confirm password</label>
              <input
                type="password"
                className="input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>
        )}

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

"use client";

import { SOCIAL_PLATFORMS, SOCIAL_PLATFORM_ORDER, createSocialLink } from "@/lib/socialLinks";

export default function FooterEditorModal({ footer, onChange, onClose }) {
  const links = footer?.socialLinks || [];

  const updateLinks = (next) => {
    onChange({ ...footer, socialLinks: next });
  };

  const handleAdd = () => {
    updateLinks([...links, createSocialLink()]);
  };

  const handlePlatformChange = (id, platform) => {
    updateLinks(links.map((l) => (l.id === id ? { ...l, platform } : l)));
  };

  const handleUrlChange = (id, url) => {
    updateLinks(links.map((l) => (l.id === id ? { ...l, url } : l)));
  };

  const handleRemove = (id) => {
    updateLinks(links.filter((l) => l.id !== id));
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card max-h-[80vh] w-full max-w-lg animate-scale-in overflow-y-auto p-6"
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Footer & social links</h2>
          <button onClick={onClose} className="text-charcoal-600 hover:text-white">
            ✕
          </button>
        </div>
        <p className="mb-5 text-sm text-charcoal-600">
          These appear in every page's footer, alongside the RS Net branding
          badge (which stays on all free sites).
        </p>

        <div className="space-y-3">
          {links.length === 0 && (
            <p className="rounded-xl border border-dashed border-charcoal-700 p-4 text-center text-sm text-charcoal-600">
              No social links yet.
            </p>
          )}

          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <select
                className="input w-40 shrink-0"
                value={link.platform}
                onChange={(e) => handlePlatformChange(link.id, e.target.value)}
              >
                {SOCIAL_PLATFORM_ORDER.map((key) => (
                  <option key={key} value={key}>
                    {SOCIAL_PLATFORMS[key].icon} {SOCIAL_PLATFORMS[key].label}
                  </option>
                ))}
              </select>
              <input
                className="input flex-1"
                value={link.url}
                onChange={(e) => handleUrlChange(link.id, e.target.value)}
                placeholder="https://…"
              />
              <button
                onClick={() => handleRemove(link.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-charcoal-700 text-charcoal-600 hover:border-red-400 hover:text-red-400"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button onClick={handleAdd} className="btn-secondary mt-4 w-full text-sm">
          + Add social link
        </button>

        <button onClick={onClose} className="btn-primary mt-3 w-full text-sm">
          Done
        </button>
      </div>
    </div>
  );
}

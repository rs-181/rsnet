"use client";

import { useState } from "react";
import { uploadSiteImage, ALLOWED_MIME_TYPES } from "@/lib/imageUpload";

export default function SiteThemeModal({ theme, onChange, onClose, siteId, ownerId }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const backgroundColor = theme?.backgroundColor || "";
  const backgroundImageUrl = theme?.backgroundImageUrl || "";

  const update = (patch) => onChange({ ...theme, ...patch });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadSiteImage({ siteId, ownerId, file });
      update({ backgroundImageUrl: url });
    } catch (err) {
      setUploadError(err.message || "Couldn't upload that image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 px-4 animate-fade-in"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="card w-full max-w-md animate-scale-in p-6">
        <h2 className="mb-1 font-display text-lg font-bold">Site theme</h2>
        <p className="mb-5 text-sm text-charcoal-600">
          Applies across every page of this site. A background image, if set, takes
          priority over the background color.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">Background color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-charcoal-700 bg-charcoal-800"
                value={backgroundColor || "#0a0a0b"}
                onChange={(e) => update({ backgroundColor: e.target.value })}
              />
              <input
                className="input"
                value={backgroundColor}
                onChange={(e) => update({ backgroundColor: e.target.value })}
                placeholder="Leave blank for the default dark theme"
              />
              {backgroundColor && (
                <button
                  onClick={() => update({ backgroundColor: "" })}
                  className="shrink-0 text-xs text-charcoal-600 hover:text-red-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-charcoal-600">Background image</label>
            <input
              className="input mb-2"
              value={backgroundImageUrl}
              onChange={(e) => update({ backgroundImageUrl: e.target.value })}
              placeholder="https://example.com/background.jpg"
            />
            <label className="btn-secondary flex w-full cursor-pointer items-center justify-center text-sm">
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept={ALLOWED_MIME_TYPES.join(",")}
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {uploadError && <p className="mt-1 text-sm text-red-400">{uploadError}</p>}
            {backgroundImageUrl && (
              <button
                onClick={() => update({ backgroundImageUrl: "" })}
                className="mt-2 text-xs text-charcoal-600 hover:text-red-400"
              >
                Remove background image
              </button>
            )}
          </div>
        </div>

        <button onClick={onClose} className="btn-primary mt-6 w-full text-sm">
          Done
        </button>
      </div>
    </div>
  );
}

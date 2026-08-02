"use client";

import { useState } from "react";
import { BLOCK_TYPES } from "@/lib/blockTypes";
import { uploadSiteImage, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/imageUpload";

export default function PropertiesPanel({ block, onChange, onDelete, onClose, siteId, ownerId }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  if (!block) {
    return (
      <div className="card p-4 text-sm text-charcoal-600">
        Select a block on the page to edit it here.
      </div>
    );
  }

  const def = BLOCK_TYPES[block.type];

  const update = (key, value) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadSiteImage({ siteId, ownerId, file });
      update("src", url);
    } catch (err) {
      setUploadError(err.message || "Couldn't upload that image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal-600">
          {def.label}
        </h2>
        <button onClick={onClose} className="text-xs text-charcoal-600 hover:text-white">
          Close
        </button>
      </div>

      <div className="space-y-3">
        {block.type === "heading" && (
          <>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Text</label>
              <input
                className="input"
                value={block.props.text}
                onChange={(e) => update("text", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Size</label>
              <select
                className="input"
                value={block.props.level}
                onChange={(e) => update("level", e.target.value)}
              >
                <option value="h1">Large (H1)</option>
                <option value="h2">Medium (H2)</option>
                <option value="h3">Small (H3)</option>
              </select>
            </div>
          </>
        )}

        {block.type === "text" && (
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">Text</label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={block.props.text}
              onChange={(e) => update("text", e.target.value)}
            />
          </div>
        )}

        {block.type === "image" && (
          <>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Image URL</label>
              <input
                className="input"
                value={block.props.src}
                onChange={(e) => update("src", e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-charcoal-700" />
              <span className="text-xs text-charcoal-600">or</span>
              <div className="h-px flex-1 bg-charcoal-700" />
            </div>

            <div>
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
              <p className="mt-1 text-xs text-charcoal-600">
                Images only, up to {MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB. Compressed
                automatically before saving.
              </p>
              {uploadError && <p className="mt-1 text-sm text-red-400">{uploadError}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Alt text</label>
              <input
                className="input"
                value={block.props.alt}
                onChange={(e) => update("alt", e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </>
        )}

        {block.type === "button" && (
          <>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Label</label>
              <input
                className="input"
                value={block.props.label}
                onChange={(e) => update("label", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Link (URL or page)</label>
              <input
                className="input"
                value={block.props.href}
                onChange={(e) => update("href", e.target.value)}
                placeholder="https:// or /about"
              />
            </div>
          </>
        )}

        {block.type === "divider" && (
          <p className="text-sm text-charcoal-600">
            A divider has no settings — it just separates content.
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(block.id)}
        className="btn-secondary mt-5 w-full text-sm text-red-400 hover:border-red-400 hover:text-red-400"
      >
        Remove block
      </button>
    </div>
  );
}

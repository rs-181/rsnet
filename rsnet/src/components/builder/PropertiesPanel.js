"use client";

import { useState } from "react";
import { BLOCK_TYPES } from "@/lib/blockTypes";
import { uploadSiteImage, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/imageUpload";

let slideCounter = 0;
function newSlideId() {
  slideCounter += 1;
  return `slide_${Date.now()}_${slideCounter}`;
}

export default function PropertiesPanel({ block, onChange, onDelete, onClose, siteId, ownerId }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [slideUploadingId, setSlideUploadingId] = useState(null);

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
    e.target.value = "";
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

  // --- Carousel slide helpers ---
  const slides = block.props.images || [];

  const updateSlides = (next) => update("images", next);

  const addSlideByUrl = () => {
    updateSlides([...slides, { id: newSlideId(), src: "", alt: "" }]);
  };

  const updateSlide = (id, patch) => {
    updateSlides(slides.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeSlide = (id) => {
    updateSlides(slides.filter((s) => s.id !== id));
  };

  const handleSlideFileChange = async (id, e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError("");
    setSlideUploadingId(id);
    try {
      const url = await uploadSiteImage({ siteId, ownerId, file });
      updateSlide(id, { src: url });
    } catch (err) {
      setUploadError(err.message || "Couldn't upload that image.");
    } finally {
      setSlideUploadingId(null);
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
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-charcoal-700 bg-charcoal-800"
                  value={block.props.color || "#ffffff"}
                  onChange={(e) => update("color", e.target.value)}
                />
                <input
                  className="input"
                  value={block.props.color || "#ffffff"}
                  onChange={(e) => update("color", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {block.type === "text" && (
          <>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Text</label>
              <textarea
                className="input min-h-[100px] resize-y"
                value={block.props.text}
                onChange={(e) => update("text", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Text size</label>
              <select
                className="input"
                value={block.props.size || "base"}
                onChange={(e) => update("size", e.target.value)}
              >
                <option value="sm">Small</option>
                <option value="base">Regular</option>
                <option value="lg">Large</option>
                <option value="xl">Extra large</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Text color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-charcoal-700 bg-charcoal-800"
                  value={block.props.color || "#f2f2f5"}
                  onChange={(e) => update("color", e.target.value)}
                />
                <input
                  className="input"
                  value={block.props.color || "#f2f2f5"}
                  onChange={(e) => update("color", e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-charcoal-600">
                Defaults to a bright, high-contrast color — pick a darker one only if your
                site background is light.
              </p>
            </div>
          </>
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

        {block.type === "video" && (
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">Video URL</label>
            <input
              className="input"
              value={block.props.url}
              onChange={(e) => update("url", e.target.value)}
              placeholder="YouTube, Vimeo, or a direct .mp4 link"
            />
            <p className="mt-1 text-xs text-charcoal-600">
              Paste a link from YouTube or Vimeo, or a direct video file URL.
            </p>
          </div>
        )}

        {block.type === "iframe" && (
          <>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Embed URL</label>
              <input
                className="input"
                value={block.props.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder="https://example.com/widget"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-charcoal-600">Height (px)</label>
              <input
                type="number"
                min="150"
                className="input"
                value={block.props.height || 480}
                onChange={(e) => update("height", Number(e.target.value) || 480)}
              />
            </div>
            <p className="text-xs text-charcoal-600">
              Only embed sites you trust — this loads their content directly on your page.
            </p>
          </>
        )}

        {block.type === "carousel" && (
          <>
            <div className="space-y-3">
              {slides.map((slide, i) => (
                <div key={slide.id} className="rounded-xl border border-charcoal-700 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-charcoal-600">Slide {i + 1}</span>
                    <button
                      onClick={() => removeSlide(slide.id)}
                      className="text-xs text-charcoal-600 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    className="input mb-2"
                    value={slide.src}
                    onChange={(e) => updateSlide(slide.id, { src: e.target.value })}
                    placeholder="Image URL"
                  />
                  <label className="btn-secondary mb-2 flex w-full cursor-pointer items-center justify-center text-xs">
                    {slideUploadingId === slide.id ? "Uploading…" : "Upload image"}
                    <input
                      type="file"
                      accept={ALLOWED_MIME_TYPES.join(",")}
                      onChange={(e) => handleSlideFileChange(slide.id, e)}
                      disabled={slideUploadingId === slide.id}
                      className="hidden"
                    />
                  </label>
                  <input
                    className="input"
                    value={slide.alt}
                    onChange={(e) => updateSlide(slide.id, { alt: e.target.value })}
                    placeholder="Alt text"
                  />
                </div>
              ))}
            </div>
            {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
            <button onClick={addSlideByUrl} className="btn-secondary w-full text-sm">
              + Add slide
            </button>
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

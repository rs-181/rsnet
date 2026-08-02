"use client";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://getrs.vercel.app";

export default function SiteCard({ site, onEdit, onDelete, onSettings }) {
  const { name, sitename, isPasswordProtected, isSuspended, pages } = site;
  const pageCount = pages?.length ?? 1;

  return (
    <div className="card group flex h-full flex-col justify-between p-5 transition hover:shadow-glow">
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white">{name}</h3>
          <div className="flex shrink-0 gap-1">
            {isSuspended && (
              <span
                title="Suspended by an admin"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-red-400/10 text-red-400"
              >
                ⚠
              </span>
            )}
            {isPasswordProtected && (
              <span
                title="Password protected"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-800 text-gold-500"
              >
                🔒
              </span>
            )}
          </div>
        </div>
        <a
          href={`${SITE_ORIGIN}/sites/${sitename}`}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm text-electric-400 hover:underline"
        >
          /sites/{sitename}
        </a>
        <p className="mt-1 text-xs text-charcoal-600">
          {pageCount} {pageCount === 1 ? "page" : "pages"}
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={() => onEdit(site)} className="btn-primary flex-1 text-sm">
          Edit
        </button>
        <button
          onClick={() => onSettings(site)}
          className="btn-secondary text-sm"
          title="Site settings"
        >
          ⚙
        </button>
        <button
          onClick={() => onDelete(site)}
          className="btn-secondary text-sm text-red-400 hover:border-red-400 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

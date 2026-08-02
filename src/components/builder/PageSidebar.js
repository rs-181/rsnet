"use client";

export default function PageSidebar({ pages, activePageId, onSelectPage, onAddPage, onRenamePage, onDeletePage }) {
  return (
    <div className="card p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-600">
        Pages
      </h2>
      <ul className="space-y-1">
        {pages.map((page) => (
          <li key={page.id}>
            <div
              className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                page.id === activePageId
                  ? "bg-gold-500 text-charcoal-950 font-medium"
                  : "text-white hover:bg-charcoal-800"
              }`}
            >
              <button onClick={() => onSelectPage(page.id)} className="flex-1 text-left">
                {page.name}
              </button>
              <div
                className={`hidden gap-1 group-hover:flex ${
                  page.id === activePageId ? "text-charcoal-900" : "text-charcoal-600"
                }`}
              >
                <button
                  onClick={() => onRenamePage(page.id)}
                  title="Rename"
                  className="hover:text-electric-400"
                >
                  ✎
                </button>
                {pages.length > 1 && (
                  <button
                    onClick={() => onDeletePage(page.id)}
                    title="Delete page"
                    className="hover:text-red-400"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={onAddPage} className="btn-secondary mt-3 w-full text-sm">
        + Add page
      </button>
    </div>
  );
}

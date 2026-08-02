export default function EmptyState({ onCreate }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-charcoal-800 text-2xl">
        ✦
      </div>
      <h2 className="font-display text-xl font-bold">No sites yet</h2>
      <p className="max-w-sm text-sm text-charcoal-600">
        Create your first site and start dragging blocks onto the page —
        no code needed.
      </p>
      <button onClick={onCreate} className="btn-primary mt-2">
        Create your first site
      </button>
    </div>
  );
}

export default function SiteSuspendedNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-950 px-6 text-center text-white">
      <div className="card max-w-sm p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-charcoal-800 text-xl">
          ⚠
        </div>
        <h1 className="mb-1 font-display text-xl font-bold">This site is unavailable</h1>
        <p className="text-sm text-charcoal-600">
          It's been suspended pending review.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6 animate-fade-in">
        <span className="font-display text-lg font-bold tracking-tight">
          RS <span className="text-gold-500">Net</span>
        </span>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="btn-secondary text-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Get started free
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto max-w-3xl px-6 pb-24 pt-16 text-center animate-fade-slide-up sm:pt-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gold-500">
          No code. No cost. No limits on ideas.
        </p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
          Build a website by <span className="text-gold-500">dragging</span>,
          not typing.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-charcoal-600">
          RS Net turns your ideas into a live, multi-page website — no HTML,
          no CSS, no plugins to install. Just drag blocks, publish, and share
          your link.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn-primary">
            Create your site
          </Link>
          <Link href="/login" className="btn-secondary">
            I already have an account
          </Link>
        </div>
      </section>
    </main>
  );
}

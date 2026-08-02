import Link from "next/link";

const FEATURES = [
  {
    icon: "🧩",
    title: "100% visual builder",
    description: "Drag blocks onto the page — headings, text, images, video, embeds, sliders. No code editor, ever.",
  },
  {
    icon: "📄",
    title: "Multi-page sites",
    description: "Add as many pages as you need — Home, About, Contact — all linked together automatically.",
  },
  {
    icon: "🎨",
    title: "Make it yours",
    description: "Custom background colors and images, text colors and sizes — your site, your look.",
  },
  {
    icon: "🔒",
    title: "Password protection",
    description: "Lock a site behind a password when you're not ready for the whole world to see it yet.",
  },
  {
    icon: "📱",
    title: "Mobile-first",
    description: "Every site you build looks sharp on phones, tablets, and desktops without any extra work.",
  },
  {
    icon: "🚀",
    title: "Free hosting, instantly",
    description: "Publish to your own URL the moment you hit save — no servers, no config, no cost.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
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

      {/* Hero */}
      <section className="relative mx-auto max-w-3xl px-6 pb-20 pt-16 text-center animate-fade-slide-up sm:pt-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gold-500">
          No code. No cost. No limits on ideas.
        </p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
          Build a website by <span className="text-gold-500">dragging</span>,
          not typing.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-charcoal-300">
          RS Net turns your ideas into a live, multi-page website — no HTML,
          no CSS, no plugins to install. Just drag blocks, publish, and share
          your link.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn-primary">
            Create your site — it's free
          </Link>
          <Link href="/login" className="btn-secondary">
            I already have an account
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Everything you need, nothing you have to learn
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-charcoal-300">
            RS Net handles the technical side so you can focus on what your site actually says.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="card p-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-charcoal-800 text-xl">
                {feature.icon}
              </div>
              <h3 className="mb-1 font-display font-bold">{feature.title}</h3>
              <p className="text-sm text-charcoal-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="card px-6 py-12 sm:px-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Your site could be live in the next five minutes.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-charcoal-300">
            No credit card, no trial that expires. Just sign up and start dragging blocks onto the page.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-primary">
              Start building for free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

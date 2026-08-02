import Link from "next/link";
import BlockRenderer from "@/components/builder/BlockRenderer";
import PublicFooter from "./PublicFooter";

export default function PublicPageRenderer({ site, page }) {
  const homePageId = site.pages?.[0]?.id;

  return (
    <div className="min-h-screen bg-charcoal-950 text-white">
      {site.pages.length > 1 && (
        <nav className="border-b border-charcoal-700">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-5 px-6 py-4 text-sm">
            {site.pages.map((p) => (
              <Link
                key={p.id}
                href={p.id === homePageId ? "/" : `/${p.slug}`}
                className={p.id === page.id ? "text-gold-500" : "text-charcoal-600 hover:text-white"}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-14">
        {page.blocks.length === 0 ? (
          <p className="text-center text-charcoal-600">This page doesn't have any content yet.</p>
        ) : (
          page.blocks.map((block) => <BlockRenderer key={block.id} block={block} />)
        )}
      </main>

      <PublicFooter footer={site.footer} />
    </div>
  );
}

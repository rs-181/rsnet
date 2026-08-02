import Link from "next/link";
import BlockRenderer from "@/components/builder/BlockRenderer";
import PublicFooter from "./PublicFooter";

export default function PublicPageRenderer({ site, page }) {
  const homePageId = site.pages?.[0]?.id;
  const theme = site.theme || {};

  const rootStyle = {};
  if (theme.backgroundColor) rootStyle.backgroundColor = theme.backgroundColor;
  if (theme.backgroundImageUrl) {
    rootStyle.backgroundImage = `url(${theme.backgroundImageUrl})`;
    rootStyle.backgroundSize = "cover";
    rootStyle.backgroundPosition = "center";
    rootStyle.backgroundAttachment = "fixed";
  }

  return (
    <div
      className="min-h-screen text-white"
      style={rootStyle}
      // Falls back to the dark theme default when no custom background is set.
      data-has-custom-bg={Boolean(theme.backgroundColor || theme.backgroundImageUrl)}
    >
      <div className={theme.backgroundColor || theme.backgroundImageUrl ? "min-h-screen bg-black/30" : "min-h-screen bg-charcoal-950"}>
        {site.pages.length > 1 && (
          <nav className="border-b border-white/10">
            <div className="mx-auto flex max-w-3xl flex-wrap gap-5 px-6 py-4 text-sm">
              {site.pages.map((p) => {
                // Fixed: previously these were relative hrefs that only
                // worked because of wildcard-subdomain middleware rewrites.
                // Now that routing is purely path-based, links must point
                // at the full /sites/{sitename}/... path or multi-page
                // navigation 404s.
                const href = p.id === homePageId ? `/sites/${site.sitename}` : `/sites/${site.sitename}/${p.slug}`;
                return (
                  <Link
                    key={p.id}
                    href={href}
                    className={p.id === page.id ? "text-gold-500" : "text-charcoal-300 hover:text-white"}
                  >
                    {p.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        <main className="mx-auto max-w-3xl space-y-6 px-6 py-14">
          {page.blocks.length === 0 ? (
            <p className="text-center text-charcoal-300">This page doesn't have any content yet.</p>
          ) : (
            page.blocks.map((block) => <BlockRenderer key={block.id} block={block} />)
          )}
        </main>

        <PublicFooter footer={site.footer} />
      </div>
    </div>
  );
}

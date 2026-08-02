import { SOCIAL_PLATFORMS } from "@/lib/socialLinks";
import BrandingBadge from "./BrandingBadge";

export default function PublicFooter({ footer }) {
  const links = (footer?.socialLinks || []).filter((l) => l.url);

  return (
    <footer className="border-t border-charcoal-700 px-6 py-8 text-center text-sm text-charcoal-600">
      {links.length > 0 && (
        <div className="flex justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={SOCIAL_PLATFORMS[link.platform]?.label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-800 transition hover:text-gold-500"
            >
              {SOCIAL_PLATFORMS[link.platform]?.icon}
            </a>
          ))}
        </div>
      )}

      {/* Mandatory on every free site — see BrandingBadge.js for why this
          can't be removed from the builder. */}
      <BrandingBadge />
    </footer>
  );
}

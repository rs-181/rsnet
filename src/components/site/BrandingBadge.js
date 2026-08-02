// These two links are intentionally hardcoded, not read from the site's
// Firestore document. There is no field for them anywhere in blockTypes.js,
// socialLinks.js, or the builder UI — that's what makes them "un-removable":
// there is simply no editable representation of them for an owner to delete.
export default function BrandingBadge() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-charcoal-600">
      <a
        href="https://rs-appstore.blogspot.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gold-500"
      >
        Powered by rs-appstore.blogspot.com
      </a>
      <span aria-hidden="true">·</span>
      <a
        href="https://rsnet.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gold-500"
      >
        Made with rsnet.vercel.app
      </a>
    </div>
  );
}

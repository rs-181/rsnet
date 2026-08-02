# RS Net — Phases 1–6 (complete)

No-code visual website builder, per `Phases.md`. All six phases are now
built:

- **Phase 1** — project setup, Firebase auth, user dashboard.
- **Phase 2** — the visual builder engine and multi-page support.
- **Phase 3** — media uploads (with client-side compression) and the
  footer/social links builder.
- **Phase 4** — wildcard subdomain publishing and site password protection.
- **Phase 5** — mandatory branding injection and UI/responsive polish.
- **Phase 6** — the hidden `/rs-admin-secret` moderation panel.

## What's included

- Next.js 14 (App Router) + Tailwind, styled per `Design.md` (dark charcoal
  theme, gold/electric-blue accents, Syne + DM Sans).
- Firebase Auth (email/password) via `src/lib/AuthContext.js`.
- Firestore-backed dashboard: list sites, create a site, delete a site,
  lock icon shown for password-protected sites, plus a **Settings** (⚙)
  button per site to turn password protection on/off and set the password.
- **Visual builder** at `/dashboard/builder/[siteId]`:
  - Block palette (Heading, Text, Image, Button, Divider) — drag onto the
    canvas or tap to append.
  - Canvas supports drag-to-reorder and click-to-select, with a properties
    panel for editing each block's content.
  - Page sidebar: add, rename, delete pages; each page has its own block
    list. A Button block's link field accepts a path like `/about` to link
    between pages.
  - "Save" persists `pages` and `footer` back to Firestore; unsaved changes
    are flagged in the header.
  - All block type definitions live in one place: `src/lib/blockTypes.js`.
- **Image blocks** (`src/lib/imageUpload.js`): URL or upload, validated
  against an image-only allowlist and a 5MB cap, compressed ~20%
  client-side, stored in Firebase Storage.
- **Footer & social links** (`src/components/builder/FooterEditorModal.js`):
  per-site social link list, saved as `footer.socialLinks`.
- **Publishing & password protection (Phase 4)**:
  - `middleware.js` detects `{subdomain}.rsnet.vercel.app` (or
    `{subdomain}.localhost` in dev) and transparently rewrites the request
    to the internal `/sites/{subdomain}` route — the visitor's URL bar
    never changes.
  - `src/app/sites/[subdomain]/page.js` and `.../[pageSlug]/page.js` render
    a published site's pages using the same `BlockRenderer` the builder
    uses, plus nav between pages and the public footer.
  - Public rendering goes through the **Firebase Admin SDK**
    (`src/lib/firebaseAdmin.js`, `src/lib/publicSite.js`) rather than a
    public Firestore read rule — `firestore.rules` still only allows an
    authenticated owner to read/write their own site doc, so nothing about
    a site is exposed to arbitrary client-side reads.
  - A site's password is only ever stored as a bcrypt hash
    (`passwordHash`, set client-side by the owner via
    `SiteSettingsModal.js`). Verifying a visitor's password happens in
    `src/app/api/site-auth/route.js`, a server route using the Admin SDK —
    per `Rules.md`, this validation never happens client-side. On a
    correct password, that route sets an HMAC-signed, httpOnly
    `rsnet_unlock_{siteId}` cookie (`src/lib/siteAuthToken.js`) so the
    visitor doesn't need to re-enter it on every page.
- `firestore.rules` restricting each site doc to its `ownerId`.
- `storage.rules` restricting uploads to their owner's path, image
  content-types only, 5MB max.
- **Mandatory branding (Phase 5)** — `src/components/site/BrandingBadge.js`
  renders "Powered by rs-appstore.blogspot.com" and "Made with
  rsnet.vercel.app" on every public site's footer. These are hardcoded
  into the renderer, not read from Firestore or any editable field, so
  there is nothing in the builder UI that could delete them — satisfying
  Rules.md's "un-removable branding" requirement structurally rather than
  by convention.
- **UI/responsive polish (Phase 5)**:
  - Entrance animations (fade/slide/scale) on the landing page, auth
    cards, dashboard site cards (staggered), and modals — respecting
    `prefers-reduced-motion`.
  - The builder header now wraps gracefully on narrow screens and gained
    a "View live ↗" link plus a brief "Saved ✓" confirmation.
  - Canvas blocks now have ↑ / ↓ move buttons in addition to native
    drag-and-drop — **native HTML5 drag-and-drop doesn't fire on touch
    devices**, so these buttons are the mobile-usable way to reorder
    blocks; drag-and-drop remains available for desktop mouse users.
- **Secret admin panel (Phase 6)** — `/rs-admin-secret`:
  - Not linked anywhere in the UI. Gated by a master password
    (`RS_ADMIN_MASTER_PASSWORD`) checked with a timing-safe comparison in
    `api/admin-auth/route.js`, which then sets a short-lived (2 hour),
    separately-signed session cookie (`src/lib/adminAuthToken.js`).
  - Every `/api/admin/*` route independently re-verifies that cookie
    (`src/lib/verifyAdminRequest.js`) — the hidden page isn't the security
    boundary, the cookie check on each request is.
  - Lists every site on the platform (owner id, subdomain, page count,
    protection/suspension status) via the Admin SDK, so it's unaffected by
    the owner-only `firestore.rules`.
  - Actions: **Edit** (rename the site / change its subdomain — deliberately
    doesn't open the block-level builder, since that requires impersonating
    the owner's identity, which is out of scope here), **Suspend/Unsuspend**,
    and **Delete**. The admin update route only accepts an explicit allowlist
    of fields (`name`, `subdomain`, `isSuspended`) so it can't be used to
    rewrite page content.
  - A suspended site immediately shows a "This site is unavailable" notice
    on its public URL (checked before the password gate), and a matching
    banner appears in that site's builder so the owner knows why.

## Setup

```bash
npm install
cp .env.local.example .env.local
# fill in your Firebase project's web config, service account key,
# RS_SITE_AUTH_SECRET, RS_ADMIN_MASTER_PASSWORD, and RS_ADMIN_SESSION_SECRET
npm run dev
```

In the Firebase console, enable **Authentication → Email/Password**,
create a **Firestore database**, and enable **Storage** — then deploy
`firestore.rules` and `storage.rules`. For the Admin SDK, go to
**Project settings → Service accounts → Generate new private key**, then
paste the resulting JSON as a single-line string into
`FIREBASE_SERVICE_ACCOUNT_KEY`.

### Trying subdomains locally

Add entries like `127.0.0.1 mysite.localhost` to your hosts file, run
`npm run dev`, and visit `http://mysite.localhost:3000`. On Vercel, add
`*.rsnet.vercel.app` as a wildcard domain in the project's domain settings —
no per-site DNS entries needed.

## Ideas for beyond Phase 6

Not asked for, but worth knowing about as you take this further:

- Deleting a site in the admin panel removes its Firestore doc but not its
  uploaded images in Storage — a scheduled Cloud Function to sweep
  `sites/{siteId}/` on delete would close that gap.
- The admin panel currently has one master password / one implicit "admin"
  identity — if this ever needs more than one moderator, it'll want real
  per-admin accounts and an audit log of who suspended/deleted what.
- Subdomain uniqueness isn't enforced anywhere yet (each new site gets a
  slug + a chunk of the owner's uid, which makes collisions unlikely but
  not impossible) — worth a uniqueness check before publishing at scale.

## Folder structure

```
middleware.js                       subdomain → /sites/{subdomain} rewrite
src/
  app/
    page.js                        landing page
    login/page.js
    signup/page.js
    dashboard/page.js               protected, lists + manages the user's sites
    dashboard/builder/[siteId]/page.js   protected, the visual builder
    sites/[subdomain]/page.js            public: a site's home page
    sites/[subdomain]/[pageSlug]/page.js public: a site's other pages
    rs-admin-secret/page.js              hidden moderation panel
    api/site-auth/route.js               server-side password validation
    api/admin-auth/route.js              admin login/logout
    api/admin/sites/route.js             admin: list all sites
    api/admin/sites/[siteId]/route.js    admin: edit/suspend/delete a site
    layout.js                        wraps app in AuthProvider
    globals.css
  components/
    Navbar.js
    SiteCard.js
    EmptyState.js
    ProtectedRoute.js
    SiteSettingsModal.js             password-protection toggle + set password
    builder/
      PageSidebar.js
      BlockPalette.js
      BuilderCanvas.js
      BlockRenderer.js
      PropertiesPanel.js
      FooterEditorModal.js
    site/
      PublicPageRenderer.js          renders a published page + nav + footer
      PublicFooter.js
      BrandingBadge.js                mandatory, hardcoded branding links
      SitePasswordGate.js             password entry form for locked sites
      SiteSuspendedNotice.js           shown for admin-suspended sites
    admin/
      AdminLoginForm.js
      AdminDashboard.js
      AdminSiteEditModal.js
  lib/
    firebase.js         Firebase client app/auth/firestore/storage init
    firebaseAdmin.js      Firebase Admin SDK init (server-only)
    publicSite.js          look up a published site by subdomain (server-only)
    siteAuthToken.js        signs/verifies the site-unlock cookie (server-only)
    adminAuthToken.js        signs/verifies the admin session cookie (server-only)
    verifyAdminRequest.js     checks the admin cookie on API requests (server-only)
    AuthContext.js       auth state + signup/login/logout
    blockTypes.js         block type registry (defaults, icons, factory)
    imageUpload.js         validation, compression, Storage upload
    socialLinks.js          social platform registry
```

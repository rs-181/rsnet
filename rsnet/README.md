# RS Net — getrs.vercel.app

A 100% no-code, visual website builder. Path-based hosting under
`/sites/[sitename]`, Firebase Auth (email/password + Google), a full
drag-and-drop builder, and a hidden moderation panel.

This build supersedes the earlier wildcard-subdomain version of the
project — subdomain routing has been completely removed in favor of
path-based routing, per a later revision of the requirements.

## What's included

### Core
- Next.js 14 (App Router) + Tailwind, dark charcoal theme with gold/electric-blue
  accents, Syne + DM Sans (`Design.md`-style, still intact from earlier phases).
- **Auth**: Firebase Authentication, email/password *and* Google sign-in
  (`src/lib/AuthContext.js`, `GoogleSignInButton.js`). Every successful
  login/signup also silently establishes a server-verifiable session
  cookie (`api/session/route.js`) — this is what powers both the admin
  panel's identity check and collision-safe site creation below.
- **Dashboard**: list, create, delete sites; a **Settings** (⚙) button
  per site for password protection; visible ⚠ badge if an admin has
  suspended the site.

### Path-based routing (replaces wildcard subdomains)
- No `middleware.js`, no wildcard DNS, nothing subdomain-related anywhere.
- A site is published at `getrs.vercel.app/sites/[sitename]`
  (`src/app/sites/[sitename]/page.js` for the home page,
  `.../[pageSlug]/page.js` for the rest).
- **Custom URLs, not random IDs**: creating a site calls
  `POST /api/sites` (`src/app/api/sites/route.js`), which — authenticated
  via the session cookie — slugifies the requested name and checks
  Firestore for a collision using the Admin SDK. If `/sites/my-cafe` is
  free, that's exactly what you get; a random ID is never used. Only on
  an actual collision does it fall back to `my-cafe-2`, `my-cafe-3`, etc.
  (This check has to go through the Admin SDK rather than a client
  Firestore read, since `firestore.rules` deliberately doesn't let one
  user's client read another user's site docs to check name availability.)

### Visual builder (`/dashboard/builder/[siteId]`)
- Blocks: **Heading, Text, Image, Video, Image slider/carousel, Embed
  (iframe), Button, Divider** — drag onto the canvas or tap to append.
  - *Video*: paste a YouTube/Vimeo link (auto-converted to an embed) or a
    direct `.mp4`/`.webm` URL (`src/lib/videoEmbed.js`).
  - *Carousel*: add multiple images (URL or upload), swipeable with
    arrow buttons and dot indicators (`CarouselBlock.js`), touch-friendly
    via native scroll-snap.
  - *Embed*: any iframe-able URL, sandboxed (`allow-scripts
    allow-same-origin allow-popups allow-forms`) so an embedded page
    can't do things like top-level navigation.
- **Text customization**: Heading and Text blocks both get a color
  picker; Text blocks also get a size selector (sm/base/lg/xl).
- **Site-wide theme**: a "Theme" button in the builder header opens
  `SiteThemeModal.js` — background color and/or a background image
  (URL or upload), applied across every page of the site.
- Canvas supports drag-to-reorder (desktop) and ↑/↓ buttons (since
  native HTML5 drag-and-drop doesn't fire on touch devices), click-to-select,
  and a properties panel per block.
- Multi-page: add/rename/delete pages; nav between them is auto-generated
  and fixed to use real `/sites/[sitename]/[pageSlug]` links (see "Bug
  fixes" below).
- "Theme", "Footer & social", and "Save" all live in the sticky header,
  along with a "View live ↗" link and a brief "Saved ✓" confirmation.

### Publishing & password protection
- Public rendering goes through the **Firebase Admin SDK**
  (`src/lib/firebaseAdmin.js`, `getSiteBySitename` in `publicSite.js`)
  rather than a public Firestore read rule — `firestore.rules` only ever
  lets an authenticated owner read/write their own doc.
- A site's password is stored only as a bcrypt hash, set by the owner via
  `SiteSettingsModal.js`. Verifying a visitor's password happens
  server-side in `api/site-auth/route.js` using the Admin SDK, never in
  the client. On success it sets an HMAC-signed, httpOnly unlock cookie.

### Text visibility fix
Live-site text used to render as dim, low-contrast gray
(`text-charcoal-600`) regardless of what the owner typed — the source of
the "blurry / low opacity" complaint. `BlockRenderer.js` now renders
Heading/Text blocks at `opacity: 1` with an explicit, bright default
color (`#f2f2f5` for body text, `#ffffff` for headings), both of which
are user-adjustable via the color picker in the properties panel.

### Branding badge
`BrandingBadge.js` — hardcoded (not read from Firestore or any editable
field, so there's nothing in the builder that could delete it) — now
reads "Made with getrs.vercel.app" and "Powered by rs-appstore.blogspot.com",
bumped from `text-xs` to `text-sm` for legibility.

### Bug fixes
- **Multi-page routing**: page-to-page nav links used to be relative
  paths that only worked by accident, via the (now-removed) wildcard
  subdomain middleware's rewrite. `PublicPageRenderer.js` now builds
  absolute `/sites/[sitename]/[pageSlug]` links directly, which is what
  actually works once wildcard rewriting is gone.
- **Password protection not unlocking**: the unlock/session cookies were
  set with `secure: true` unconditionally. Browsers silently drop
  `secure` cookies over plain HTTP — exactly what local dev serves over —
  so a correct password would appear to "not work" locally even though
  the check itself was fine. Cookies now only require `secure` in
  production (`process.env.NODE_ENV === "production"`), where the app is
  always served over HTTPS anyway. The unlock form also now does a full
  `window.location.reload()` instead of `router.refresh()`, so the
  freshly-set cookie is guaranteed to be picked up on the very next
  request rather than possibly racing a client-side refresh.

### Ghost admin panel — `/rs-secret-dashboard-99x`
- Not linked anywhere in the UI, no metadata hinting at its existence.
- **No password prompt of its own.** Authorization is a direct check
  against Firebase Auth: the page reads the session cookie already
  established by normal login, verifies it server-side
  (`adminAuth.verifySessionCookie`), and compares the decoded email to
  `RS_OWNER_EMAIL`. Anyone else — including another logged-in user, or
  someone with no session at all — gets Next.js's real `notFound()`, i.e.
  an ordinary 404, not a login screen or "access denied" page that would
  confirm the route exists.
- Every `/api/admin/*` route independently re-runs that same check
  (`verifyAdminRequest.js`) rather than trusting that a request reaching
  it is automatically legitimate.
- Lists every site (owner id, URL, page count, protection/suspension
  status) via the Admin SDK. Actions: **Edit** (name / URL sitename),
  **Suspend / Unsuspend**, **Delete** — the update route only accepts an
  explicit field allowlist, so it can't be used to rewrite page content.
- A suspended site shows an "unavailable" notice on its public URL
  (checked before the password gate) and a matching banner in the
  owner's builder.
- `firestore.rules` blocks an owner from writing `isSuspended` on their
  own doc via the client SDK — only the Admin SDK (which bypasses these
  rules) can flip it, closing off a "suspended owner just un-suspends
  themselves" loophole that existed in an earlier draft of this rule.

## Setup

```bash
npm install
cp .env.local.example .env.local
# fill in your Firebase web config, RS_OWNER_EMAIL, RS_SITE_AUTH_SECRET,
# and FIREBASE_SERVICE_ACCOUNT_KEY
npm run dev
```

In the Firebase console:
1. **Authentication** → enable **Email/Password** *and* **Google** as sign-in providers.
2. Create a **Firestore database**, enable **Storage**, then deploy
   `firestore.rules` and `storage.rules`.
3. **Project settings → Service accounts → Generate new private key**,
   then paste the resulting JSON as a single-line string into
   `FIREBASE_SERVICE_ACCOUNT_KEY`.
4. Set `RS_OWNER_EMAIL` to whichever Google/email account should be able
   to see `/rs-secret-dashboard-99x` — sign into the app normally with
   that account, then visit the URL directly.

### Deploying to Vercel

No code edits needed after extraction — everything reads from env vars.
Add the four `.env.local` values (plus the Firebase web config) as
Environment Variables in the Vercel project settings, then deploy. The
site is served at whatever domain you attach (defaulting to
`getrs.vercel.app` in the UI copy and `NEXT_PUBLIC_SITE_ORIGIN`) —
no wildcard domain configuration is required anymore, since routing is
path-based.

## Ideas for beyond this build

Not asked for, but worth knowing about:
- Deleting a site removes its Firestore doc but not its uploaded images
  in Storage — a scheduled Cloud Function to sweep `sites/{siteId}/` on
  delete would close that gap.
- The admin panel checks a single owner email — if this ever needs more
  than one moderator, it'll want a list of allowed emails (or Firestore
  custom claims) and an audit log of who suspended/deleted what.
- The admin's own site-rename action doesn't re-run the uniqueness check
  that `/api/sites` does on creation — worth adding if admin edits become
  frequent.
- Embed (iframe) blocks trust whatever URL the site owner pastes in; the
  sandbox attribute limits blast radius but doesn't vet the URL itself.

## Folder structure

```
src/
  app/
    page.js                        landing page (hero + features + CTA)
    login/page.js                   email/password + Google
    signup/page.js                  email/password + Google
    dashboard/page.js               protected, lists + manages the user's sites
    dashboard/builder/[siteId]/page.js   protected, the visual builder
    sites/[sitename]/page.js             public: a site's home page
    sites/[sitename]/[pageSlug]/page.js  public: a site's other pages
    rs-secret-dashboard-99x/page.js       ghost admin panel (email-gated, else 404)
    api/session/route.js                 Firebase ID token → session cookie
    api/sites/route.js                    server-side site creation (name collisions)
    api/site-auth/route.js                server-side password validation
    api/admin/sites/route.js              admin: list all sites
    api/admin/sites/[siteId]/route.js     admin: edit/suspend/delete a site
    layout.js
    globals.css
  components/
    GoogleSignInButton.js
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
      CarouselBlock.js
      PropertiesPanel.js
      FooterEditorModal.js
      SiteThemeModal.js
    site/
      PublicPageRenderer.js          renders a published page + nav + footer + theme
      PublicFooter.js
      BrandingBadge.js
      SitePasswordGate.js
      SiteSuspendedNotice.js
    admin/
      AdminDashboard.js
      AdminSiteEditModal.js
  lib/
    firebase.js            Firebase client app/auth/firestore/storage init
    firebaseAdmin.js         Firebase Admin SDK init (server-only)
    sessionCookie.js          shared session cookie name/maxAge constants
    publicSite.js             look up a published site by sitename (server-only)
    siteAuthToken.js           signs/verifies the site-unlock cookie (server-only)
    verifyAdminRequest.js       session-cookie + owner-email check (server-only)
    AuthContext.js            auth state incl. Google sign-in + session sync
    blockTypes.js               block type registry (defaults, icons, factory)
    videoEmbed.js                 YouTube/Vimeo URL → embed parsing
    imageUpload.js                 validation, compression, Storage upload
    socialLinks.js                   social platform registry
```

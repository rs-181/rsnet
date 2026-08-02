import { adminAuth } from "./firebaseAdmin";
import { SESSION_COOKIE_NAME } from "./sessionCookie";

const OWNER_EMAIL = process.env.RS_OWNER_EMAIL;

// Used by every /api/admin/* route. Each route calls this independently —
// reaching the route at all proves nothing; this check is the actual
// security boundary, not the obscurity of the URL.
export async function isAuthorizedAdminRequest(request) {
  if (!OWNER_EMAIL) return false;

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return false;

  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    return !!decoded.email && decoded.email.toLowerCase() === OWNER_EMAIL.toLowerCase();
  } catch {
    return false;
  }
}

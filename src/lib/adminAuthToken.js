import crypto from "crypto";

// RS_ADMIN_SESSION_SECRET signs the admin session cookie. Deliberately a
// separate secret from RS_SITE_AUTH_SECRET so compromising one token
// scheme doesn't compromise the other. Server-only.
function getSecret() {
  const secret = process.env.RS_ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("RS_ADMIN_SESSION_SECRET is not set.");
  }
  return secret;
}

const ADMIN_TOKEN_SUBJECT = "rs-admin-session";

export function createAdminToken() {
  return crypto.createHmac("sha256", getSecret()).update(ADMIN_TOKEN_SUBJECT).digest("hex");
}

export function isValidAdminToken(token) {
  if (!token) return false;
  const expected = createAdminToken();
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const ADMIN_COOKIE_NAME = "rsnet_admin_session";

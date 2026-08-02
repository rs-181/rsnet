import crypto from "crypto";

// RS_SITE_AUTH_SECRET signs the unlock cookie so it can't be forged without
// knowing the server secret. Server-only — never expose this value to the client.
function getSecret() {
  const secret = process.env.RS_SITE_AUTH_SECRET;
  if (!secret) {
    throw new Error("RS_SITE_AUTH_SECRET is not set.");
  }
  return secret;
}

export function createUnlockToken(siteId) {
  return crypto.createHmac("sha256", getSecret()).update(siteId).digest("hex");
}

export function isValidUnlockToken(siteId, token) {
  if (!token) return false;
  const expected = createUnlockToken(siteId);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function unlockCookieName(siteId) {
  return `rsnet_unlock_${siteId}`;
}

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { SESSION_COOKIE_NAME } from "@/lib/sessionCookie";
import { slugify } from "@/lib/blockTypes";

export const runtime = "nodejs";

const MAX_SUFFIX_ATTEMPTS = 50;

async function findAvailableSitename(desiredSlug) {
  const sitesRef = adminDb.collection("sites");

  const baseSnap = await sitesRef.where("sitename", "==", desiredSlug).limit(1).get();
  if (baseSnap.empty) return desiredSlug;

  // Only reached if the exact requested name is taken — fall back to a
  // short numbered suffix instead of a random ID, per the PRD's
  // "don't use auto-generated random IDs if the requested name is
  // available" requirement (this branch is specifically the case where
  // it *isn't* available).
  for (let i = 2; i <= MAX_SUFFIX_ATTEMPTS; i++) {
    const candidate = `${desiredSlug}-${i}`;
    const snap = await sitesRef.where("sitename", "==", candidate).limit(1).get();
    if (snap.empty) return candidate;
  }

  // Extremely unlikely fallback if 50 numbered variants are all taken.
  return `${desiredSlug}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function POST(request) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return NextResponse.json({ ok: false, error: "Session expired — please log in again." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const requestedName = (body?.name || "").trim();
  if (!requestedName) {
    return NextResponse.json({ ok: false, error: "Site name is required." }, { status: 400 });
  }

  const desiredSlug = slugify(requestedName) || "site";
  const sitename = await findAvailableSitename(desiredSlug);

  const docRef = await adminDb.collection("sites").add({
    name: requestedName,
    sitename,
    ownerId: decoded.uid,
    isPasswordProtected: false,
    isSuspended: false,
    theme: { backgroundColor: "", backgroundImageUrl: "" },
    footer: { socialLinks: [] },
    pages: [{ id: "home", name: "Home", slug: "home", blocks: [] }],
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({
    ok: true,
    site: { id: docRef.id, name: requestedName, sitename },
  });
}

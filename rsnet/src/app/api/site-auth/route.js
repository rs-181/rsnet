import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminDb } from "@/lib/firebaseAdmin";
import { createUnlockToken, unlockCookieName } from "@/lib/siteAuthToken";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { siteId, password } = body || {};
  if (!siteId || !password) {
    return NextResponse.json(
      { ok: false, error: "Missing site or password." },
      { status: 400 }
    );
  }

  const snap = await adminDb.collection("sites").doc(siteId).get();
  if (!snap.exists) {
    return NextResponse.json({ ok: false, error: "Site not found." }, { status: 404 });
  }

  const data = snap.data();
  if (!data.isPasswordProtected || !data.passwordHash) {
    return NextResponse.json({ ok: true });
  }

  const matches = await bcrypt.compare(password, data.passwordHash);
  if (!matches) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(unlockCookieName(siteId), createUnlockToken(siteId), {
    httpOnly: true,
    // secure:true unconditionally would make the browser silently drop
    // this cookie over plain HTTP — i.e. during local dev — which looks
    // exactly like "the password never unlocks the site" even though the
    // check above passed. Only require it in production, where the app is
    // always served over HTTPS anyway.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
  return response;
}

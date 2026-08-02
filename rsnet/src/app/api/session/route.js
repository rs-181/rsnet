import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/sessionCookie";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { idToken } = body || {};
  if (!idToken) {
    return NextResponse.json({ ok: false, error: "Missing ID token." }, { status: 400 });
  }

  try {
    // Verifies the token is genuinely from Firebase Auth before minting a
    // cookie for it — this is what lets server components and API routes
    // trust "who is this request from" without re-hitting client SDKs.
    await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return response;
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Couldn't establish a session." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

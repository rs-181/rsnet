import crypto from "crypto";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminToken } from "@/lib/adminAuthToken";

function timingSafeStringsEqual(a, b) {
  const bufA = Buffer.from(a || "", "utf8");
  const bufB = Buffer.from(b || "", "utf8");
  if (bufA.length !== bufB.length) {
    // Still do a comparison of equal length to avoid an early-return timing leak.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { password } = body || {};
  const masterPassword = process.env.RS_ADMIN_MASTER_PASSWORD;

  if (!masterPassword) {
    return NextResponse.json(
      { ok: false, error: "Admin access isn't configured on this deployment." },
      { status: 500 }
    );
  }

  if (!password || !timingSafeStringsEqual(password, masterPassword)) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours — short-lived on purpose for a powerful session
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

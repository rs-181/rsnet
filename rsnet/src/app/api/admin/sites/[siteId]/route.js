import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { isAuthorizedAdminRequest } from "@/lib/verifyAdminRequest";

export const runtime = "nodejs";

// Fields an admin is allowed to change. Deliberately narrow — an admin
// moderates, it doesn't get to silently rewrite a site's page content.
const ALLOWED_FIELDS = ["name", "sitename", "isSuspended"];

export async function PATCH(request, { params }) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const updates = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) updates[field] = body[field];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, error: "No valid fields to update." }, { status: 400 });
  }

  const ref = adminDb.collection("sites").doc(params.siteId);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ ok: false, error: "Site not found." }, { status: 404 });
  }

  await ref.update(updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const ref = adminDb.collection("sites").doc(params.siteId);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ ok: false, error: "Site not found." }, { status: 404 });
  }

  await ref.delete();
  // Note: this removes the Firestore doc only. Any images the site uploaded
  // to Storage under sites/{siteId}/ are orphaned — worth a follow-up
  // Cloud Function to sweep those on site deletion.
  return NextResponse.json({ ok: true });
}

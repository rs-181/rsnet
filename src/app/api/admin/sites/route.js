import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { isAuthorizedAdminRequest } from "@/lib/verifyAdminRequest";

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const snapshot = await adminDb.collection("sites").get();
  const sites = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      subdomain: data.subdomain,
      ownerId: data.ownerId,
      isPasswordProtected: !!data.isPasswordProtected,
      isSuspended: !!data.isSuspended,
      pageCount: data.pages?.length || 0,
      createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
    };
  });

  // Newest first, since that's usually most relevant for moderation.
  sites.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return NextResponse.json({ ok: true, sites });
}

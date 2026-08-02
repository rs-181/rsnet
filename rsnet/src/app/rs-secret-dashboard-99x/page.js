import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adminAuth } from "@/lib/firebaseAdmin";
import { SESSION_COOKIE_NAME } from "@/lib/sessionCookie";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const runtime = "nodejs";

// No metadata, no nav link, no visible affordance anywhere in the app
// points here. Authorization is a real server-side check against Firebase
// Auth, not a client-side redirect — an unauthorized visitor gets exactly
// the same 404 Next.js serves for a route that doesn't exist, not a
// login form or an "access denied" page that would confirm this exists.
export default async function GhostAdminPage() {
  const ownerEmail = process.env.RS_OWNER_EMAIL;
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!ownerEmail || !sessionCookie) {
    notFound();
  }

  let decoded;
  try {
    decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    notFound();
  }

  if (!decoded?.email || decoded.email.toLowerCase() !== ownerEmail.toLowerCase()) {
    notFound();
  }

  return <AdminDashboard />;
}

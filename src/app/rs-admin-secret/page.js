import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidAdminToken } from "@/lib/adminAuthToken";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

// Not linked from anywhere in the UI — the hidden path plus the master
// password are what gate this. Real enforcement is server-side: this page
// checks the signed cookie, and every /api/admin/* route re-checks it
// independently rather than trusting that a request reached this far.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminSecretPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthorized = isValidAdminToken(token);

  return isAuthorized ? <AdminDashboard /> : <AdminLoginForm />;
}

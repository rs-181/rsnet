import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSiteBySitename } from "@/lib/publicSite";
import { isValidUnlockToken, unlockCookieName } from "@/lib/siteAuthToken";
import PublicPageRenderer from "@/components/site/PublicPageRenderer";
import SitePasswordGate from "@/components/site/SitePasswordGate";
import SiteSuspendedNotice from "@/components/site/SiteSuspendedNotice";

export const runtime = "nodejs";

export default async function PublicSiteHomePage({ params }) {
  const site = await getSiteBySitename(params.sitename);
  if (!site || !site.pages?.length) notFound();

  if (site.isSuspended) {
    return <SiteSuspendedNotice />;
  }

  if (site.isPasswordProtected) {
    const cookieStore = cookies();
    const token = cookieStore.get(unlockCookieName(site.id))?.value;
    if (!isValidUnlockToken(site.id, token)) {
      return <SitePasswordGate siteId={site.id} siteName={site.name} />;
    }
  }

  return <PublicPageRenderer site={site} page={site.pages[0]} />;
}

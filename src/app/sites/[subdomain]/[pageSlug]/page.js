import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSiteBySubdomain } from "@/lib/publicSite";
import { isValidUnlockToken, unlockCookieName } from "@/lib/siteAuthToken";
import PublicPageRenderer from "@/components/site/PublicPageRenderer";
import SitePasswordGate from "@/components/site/SitePasswordGate";
import SiteSuspendedNotice from "@/components/site/SiteSuspendedNotice";

export default async function PublicSiteSubPage({ params }) {
  const { subdomain, pageSlug } = params;
  const site = await getSiteBySubdomain(subdomain);
  if (!site || !site.pages?.length) notFound();

  if (site.isSuspended) {
    return <SiteSuspendedNotice />;
  }

  const page = site.pages.find((p) => p.slug === pageSlug || p.id === pageSlug);
  if (!page) notFound();

  if (site.isPasswordProtected) {
    const cookieStore = cookies();
    const token = cookieStore.get(unlockCookieName(site.id))?.value;
    if (!isValidUnlockToken(site.id, token)) {
      return <SitePasswordGate siteId={site.id} siteName={site.name} />;
    }
  }

  return <PublicPageRenderer site={site} page={page} />;
}

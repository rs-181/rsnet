import { NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "rsnet.vercel.app";

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = (request.headers.get("host") || "").split(":")[0];

  const isRootDomain =
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === "localhost";

  if (isRootDomain) {
    return NextResponse.next();
  }

  // Expect "{subdomain}.rsnet.vercel.app" in production, or
  // "{subdomain}.localhost" during local dev.
  let subdomain = null;
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = hostname.slice(0, -1 * (ROOT_DOMAIN.length + 1));
  } else if (hostname.endsWith(".localhost")) {
    subdomain = hostname.slice(0, -".localhost".length);
  }

  if (!subdomain) {
    // Unrecognized host shape (custom domain not yet supported) — pass through.
    return NextResponse.next();
  }

  url.pathname = `/sites/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, and anything that looks like a static file.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

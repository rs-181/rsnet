import { NextResponse } from "next/server";

export function middleware(request) {
  // Subdomain logic yahan se hata diya gaya hai.
  // Ab Next.js default path-based routing ka use karega.
  return NextResponse.next();
}

export const config = {
  // API routes aur static files ko chhodkar baki sab par apply hoga
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

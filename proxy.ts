import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

/**
 * /admin koruması — birinci kademe (hızlı eleme).
 *
 * Yalnızca oturum çerezinin VARLIĞI kontrol edilir; kriptografik doğrulama
 * + admin claim kontrolü ikinci kademede, app/admin/(panel)/layout.tsx
 * içinde (getAdminSession) yapılır. /admin/login hariç tutulur.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

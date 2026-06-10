import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static assets, Next internals — always allow
  // (handled by matcher below, but just in case)

  // Public routes — allow without token
  const publicRoutes = ["/login", "/register"];

  const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get JWT token
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Not logged in
  if (!token) {
    // Allow homepage for unauthenticated users (just the root "/")
    if (pathname === "/") {
      return NextResponse.next();
    }

    // Everything else → redirect to login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in — role-based protection
  const role = token.role as string;

  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/delivery") && role !== "deliveryBoy") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files (images, assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};

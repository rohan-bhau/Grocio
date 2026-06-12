import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always public routes
  const publicRoutes = ["/login", "/register", "/api/auth", "/unauthorized"]
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Homepage is public
  if (pathname === "/") {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET })

  // Not logged in - redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", req.url)
    console.log(loginUrl, req.url)
    return NextResponse.redirect(loginUrl)
  }

  const role = token.role

  // Role based protection
  // If a user role tries to access /admin or /delivery - block
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  if (pathname.startsWith("/delivery") && role !== "deliveryBoy") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
}
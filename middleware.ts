import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Define paths that are considered public (accessible without authentication)
  const isPublicPath =
    path === "/login" || path === "/register" || path === "/api/auth/login" || path === "/api/auth/register"

  // Get the token from the request cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // Redirect to login if accessing a protected route without a token
  if (!isPublicPath && !token && path !== "/") {
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  // Redirect to dashboard if accessing login/register with a valid token
  if (isPublicPath && token && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const response = NextResponse.next();
  const path: string = request.nextUrl.pathname;
  const hasAccessToken = cookieStore.has("access_token");

  if (path === "/create-post" && !hasAccessToken) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/onboarding",
    "/blogs/:path*",
    "/create-post",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const isPrivateRoute =
      request.nextUrl.pathname.startsWith("/user") ||
      request.nextUrl.pathname.startsWith("/salon-owner");

    if (!token && isPrivateRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && !isPrivateRoute) {
      const role = request.cookies.get("role")?.value;
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"
import { NextResponse } from "next/server"
import { env } from "./lib/env"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isProduction = env.NODE_ENV === "production"
  
  // Enforce HTTPS in production
  if (isProduction && req.headers.get("x-forwarded-proto") !== "https") {
    return NextResponse.redirect(
      `https://${req.headers.get("host")}${req.nextUrl.pathname}${req.nextUrl.search}`,
      301
    )
  }

  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup")
  const isProtectedPage = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/editor")

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  }

  if (!isAuth && isProtectedPage) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/login", "/signup"],
}

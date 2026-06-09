import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Pages publiques
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/admin/unauthorized") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 🔒 PROTÉGER LES FAVORIS (connexion obligatoire)
  if (pathname.startsWith("/favoris")) {
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 🔒 PROTÉGER SEULEMENT LES SOUS-PAGES ADMIN
  if (pathname.startsWith("/admin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/unauthorized", req.url)
      );
    }
    // 🔒 PROTECTION AJOUT PRODUIT
if (pathname.startsWith("/products")) {
  if (!token || token.role !== "admin") {
    return NextResponse.redirect(
      new URL("/admin/unauthorized", req.url)
    );
  }
}

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/favoris"],
};

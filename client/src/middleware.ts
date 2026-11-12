import { NextResponse, type NextRequest } from "next/server";

const publicPaths = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const hasToken = Boolean(req.cookies.get("mt_session")?.value);
  const { pathname } = req.nextUrl;
  const isPublic = publicPaths.includes(pathname);

  if (!hasToken && !isPublic) return NextResponse.redirect(new URL("/login", req.url));
  if (hasToken && isPublic) return NextResponse.redirect(new URL("/dashboard", req.url));
  if (pathname === "/") return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"] };

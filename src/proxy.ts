import { NextResponse, type NextRequest } from "next/server";
import { PASS_COOKIE, checkPassCookie, passcode } from "@/server/auth/passcode";

export function proxy(req: NextRequest) {
  const expected = passcode();
  if (!expected) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname === "/login" || pathname === "/api/login") return NextResponse.next();
  if (checkPassCookie(req.cookies.get(PASS_COOKIE)?.value, expected)) return NextResponse.next();

  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  // _next 내부 파일과 확장자가 있는 정적 파일(favicon, 이미지 등)은 제외.
  matcher: ["/((?!_next/|.*\\.[\\w]+$).*)"],
};

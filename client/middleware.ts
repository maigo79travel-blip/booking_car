import { NextRequest, NextResponse } from "next/server";

const locales = new Set(["vi", "en", "ko", "ru", "zh"]);

export function middleware(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean)[0];
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locales.has(firstSegment) ? firstSegment : "vi");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)"] };

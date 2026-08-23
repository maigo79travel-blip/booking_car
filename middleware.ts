import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    const validLocales = ["vi", "en", "ko", "ru", "zh"];
    const locale = validLocales.includes(firstSegment) ? firstSegment : "vi";

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", locale);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

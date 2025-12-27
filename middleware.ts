import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { languages, fallbackLng, cookieName } from "./app/i18n/settings";

function getLocale(request: NextRequest): string | undefined {
  // Check cookie first
  if (request.cookies.has(cookieName)) {
    const cookieLocale = request.cookies.get(cookieName)?.value;
    if (cookieLocale && languages.includes(cookieLocale)) {
      return cookieLocale;
    }
  }

  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = languages;

  // Use negotiator and intl-localematcher to get best locale
  let languagesHeader = new Negotiator({
    headers: negotiatorHeaders,
  }).languages(locales);

  try {
    return matchLocale(languagesHeader, locales, fallbackLng);
  } catch (e) {
    return fallbackLng;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|manifest).*)",
  ],
};

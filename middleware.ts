import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Keep middleware lean: only check if a session cookie exists; role checks happen on server pages

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') || pathname.startsWith('/phase-1')) {
    const cookie = req.cookies.get('jb_session')?.value;
    if (!cookie) {
      const url = new URL('/login', req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/phase-1'],
};



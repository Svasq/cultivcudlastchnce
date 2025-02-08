import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/about',
  '/contact',
  '/enterprise',
  '/pricing',
  '/customers',
  '/auth/signin',
  '/auth/signup',
  '/api/login',
  '/api/register'
];

// Paths that are accessible in the View More dropdown
const viewMorePaths = [
  '/communities',
  '/forums',
  '/live',
  '/marketplace',
  '/feedback'
];

// Protected routes that require authentication
const protectedPaths = [
  "/dashboard",
  "/forums/create",
  "/api/forums/threads/:path*",
  "/communities/create",
  "/api/communities",
  "/api/users/:path*",
  "/my-communities",
  "/my-posts",
  "/my-listings",
  "/marketplace/create"
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow public paths and static assets
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.includes('/api/public')
  ) {
    return NextResponse.next();
  }

  // Check if the path is protected or requires auth
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path.replace("/:path*", ""))
  );

  // Allow view more paths without auth
  if (viewMorePaths.includes(pathname) && !isProtectedPath) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedPath) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // For page routes, redirect to login
      if (!pathname.startsWith('/api/')) {
        const redirectUrl = new URL('/auth/signin', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      // For API routes, return 401
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch (error) {
      console.error("Error verifying token:", error);
      
      // For page routes, redirect to login
      if (!pathname.startsWith('/api/')) {
        const redirectUrl = new URL('/auth/signin', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      // For API routes, return 401
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

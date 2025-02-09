import { auth } from '@/auth'

// Simple middleware that only protects routes
export default auth((req) => {
  // Public routes are always accessible
  if (req.nextUrl.pathname.startsWith('/auth')) return;
  
  // For all other routes, we'll check auth in the route handlers
  if (!req.auth) {
    return Response.redirect(new URL('/auth/signin', req.url));
  }
})

export const config = {
  matcher: [
    '/app/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/dashboard/:path*'
  ]
};
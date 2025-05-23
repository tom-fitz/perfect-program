import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user;
    //   const isOnPublic = nextUrl.pathname.startsWith('/public');
    //   const isOnAuth = nextUrl.pathname.startsWith('/auth');
    //   const isOnApp = nextUrl.pathname.startsWith('/app');
    //   // Allow public pages
    //   if (isOnPublic) return true;
    //   // Redirect to home if logged-in user tries to access auth pages
    //   if (isOnAuth) {
    //     if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
    //     return true;
    //   }
    //   // Protect /app routes
    //   if (isOnApp) {
    //     if (!isLoggedIn) return false;
    //     return true;
    //   }
    //   // Allow all other routes
    //   return true;
    // }
  }
} satisfies NextAuthConfig;

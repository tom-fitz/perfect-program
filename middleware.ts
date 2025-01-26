import { auth } from "@/auth";

export default auth((req) => {
  // req.auth contains the session
  // Your middleware code here if needed
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 
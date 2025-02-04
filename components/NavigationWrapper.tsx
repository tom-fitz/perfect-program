// components/NavigationWrapper.tsx
import { auth } from "@/auth";
import Navigation from "./Navigation";

export default async function NavigationWrapper() {
  const session = await auth();
  
  return (
    <Navigation 
      session={session} 
      initialPathname={session?.user ? "/app" : "/"}
    />
  );
}
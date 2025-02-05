// components/NavigationWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { Session } from 'next-auth';

export default function NavigationWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch session on client side to avoid hydration mismatch
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, []);

  // Don't render anything until after hydration
  if (!mounted) return null;

  return <Navigation session={session} initialPathname={pathname || ''} />;
}

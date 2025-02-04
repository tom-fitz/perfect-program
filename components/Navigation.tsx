'use client';

import { Home, Dumbbell, Calendar, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import UserAvatar from "./UserAvatar";

interface NavigationProps {
  session: Session | null;
  initialPathname: string;
}

const navItems = [
  { href: "/app", icon: Home, label: "Home" },
  { href: "/app/workouts", icon: Dumbbell, label: "Workouts" },
  { href: "/app/schedule", icon: Calendar, label: "Schedule" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
];

export default function Navigation({ session, initialPathname }: NavigationProps) {
  const pathname = usePathname() || initialPathname;
  
  if (!session?.user) {
    return null;
  }
  
  const isAdmin = session.user.email === 'tpfitz42@gmail.com';
  
  return (
    <nav className="fixed left-0 top-0 h-full w-16 flex flex-col items-center py-8 bg-ebony text-powder border-r border-gray-800">
      {/* Logo */}
      <div className="mb-8 text-xl font-bold text-sunglow">
        PP
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col items-center gap-6 w-full">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href) && 
            (href === '/app' ? pathname === '/app' : true);
          return (
            <Link
              key={href}
              href={href}
              className={`relative p-3 rounded-lg transition-colors group ${
                isActive 
                  ? "text-sunglow bg-black/20" 
                  : "text-powder hover:text-sunglow hover:bg-black/10"
              }`}
              title={label}
            >
              <Icon size={24} />
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-powder text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="mt-auto w-full flex flex-col items-center gap-4 pt-6 border-t border-gray-800">
        {isAdmin && (
          <Link
            href="/admin"
            className={`relative p-3 rounded-lg transition-colors ${
              pathname.startsWith('/admin') 
                ? "text-sunglow" 
                : "text-powder hover:text-sunglow"
            }`}
            title="Admin Dashboard"
          >
            <Shield size={24} />
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-powder text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              Admin
            </div>
          </Link>
        )}
        <Link
          href="/app/profile"
          className={`relative p-3 rounded-lg transition-colors ${
            pathname === "/app/profile" 
              ? "text-sunglow" 
              : "text-powder hover:text-sunglow"
          }`}
          title={session.user.name || "Profile"}
        >
          <div className="w-6 h-6">
            <UserAvatar 
              imageUrl={session.user.image} 
              name={session.user.name} 
            />
          </div>
          <div className="absolute left-full px-2 py-1 bg-gray-900 text-powder text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            Profile
          </div>
        </Link>
      </div>
    </nav>
  );
} 
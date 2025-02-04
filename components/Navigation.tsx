'use client';

import { Home, Dumbbell, Calendar, Settings } from "lucide-react";
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
  
  return (
    <nav className="fixed left-0 top-0 h-full w-16 peer group hover:w-48 transition-[width] duration-200 flex flex-col items-center py-8 bg-ebony text-powder">
      {/* Logo */}
      <div className="mb-8 text-xl font-bold text-sunglow">
        PP
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col items-center gap-8 w-full px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`p-2 rounded-lg transition-colors hover:text-sunglow w-full flex items-center gap-3 ${
                isActive ? "text-sunglow" : ""
              }`}
              title={label}
            >
              <Icon size={20} className="min-w-[20px]" />
              <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="mt-auto w-full px-2">
        <Link
          href="/app/profile"
          className={`p-2 rounded-lg transition-colors hover:text-sunglow w-full flex items-center gap-3 ${
            pathname === "/app/profile" ? "text-sunglow" : ""
          }`}
          title={session.user.name || "Profile"}
        >
          <div className="min-w-[32px]">
            <UserAvatar 
              imageUrl={session.user.image} 
              name={session.user.name} 
            />
          </div>
          <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis">
            {session.user.name}
          </span>
        </Link>
      </div>
    </nav>
  );
} 
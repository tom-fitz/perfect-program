'use client';

import { Users, Dumbbell, Video, DollarSign, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import UserAvatar from "./UserAvatar";

interface AdminNavProps {
  session: Session | null;
}

const adminNavItems = [
  { href: "/admin/clients", icon: Users, label: "Clients" },
  { href: "/admin/workouts", icon: Dumbbell, label: "Workouts" },
  { href: "/admin/exercises", icon: Video, label: "Exercises" },
  { href: "/admin/billing", icon: DollarSign, label: "Billing" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export default function AdminNav({ session }: AdminNavProps) {
  const pathname = usePathname();
  
  if (!session?.user) {
    return null;
  }
  
  return (
    <nav className="h-full w-64 flex flex-col py-8 bg-ebony text-powder border-l border-gray-800">
      <div className="flex-1 px-4">
        {adminNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:text-sunglow mb-2 ${
                isActive ? "text-sunglow bg-black/10" : ""
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 
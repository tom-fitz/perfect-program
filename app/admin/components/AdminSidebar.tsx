'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  CreditCard,
  Settings,
  FolderKanban
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Programs', href: '/admin/programs', icon: FolderKanban },
  { name: 'Exercises', href: '/admin/exercises', icon: Dumbbell },
  { name: 'Workouts', href: '/admin/workouts', icon: Calendar },
  { name: 'Billing', href: '/admin/billing', icon: CreditCard },
  { name: 'Settings', href: '/admin/settings', icon: Settings }
];

export default function AdminSidebar() {
  const [sidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-0 left-16 bottom-0 w-64 bg-ebony border-l border-gray-800 transition-transform duration-300 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 bg-black/20">
        <h1 className="text-xl font-bold text-powder">Admin Portal</h1>
      </div>
      <nav className="px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 my-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sunglow text-ebony'
                  : 'text-gray-400 hover:text-white hover:bg-black/20'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

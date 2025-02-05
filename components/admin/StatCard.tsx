import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: string;
  href: string;
}

export default function StatCard({ title, value, icon: Icon, trend, href }: StatCardProps) {
  return (
    <Link href={href} className="block">
      <div className="p-6 bg-ebony rounded-lg hover:bg-ebony/80 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-powder mt-1">{value}</p>
          </div>
          <Icon className="w-8 h-8 text-sunglow" />
        </div>
        <p className="text-sm text-emerald-400 mt-4">{trend} from last month</p>
      </div>
    </Link>
  );
} 
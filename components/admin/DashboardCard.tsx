interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

export default function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="bg-ebony rounded-lg p-6">
      <h2 className="text-lg font-semibold text-powder mb-4">{title}</h2>
      {children}
    </div>
  );
}

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email || session.user.email !== 'tpfitz42@gmail.com') {
    redirect('/app');
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-80 flex-1 p-8">{children}</div>
    </div>
  );
}

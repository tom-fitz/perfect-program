import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Protected Dashboard</h1>
        <p className="mb-4">Welcome back, {session.user.name}!</p>
        <p className="text-gray-600">
          This page is only accessible to authenticated users.
        </p>
      </div>
    </div>
  );
}

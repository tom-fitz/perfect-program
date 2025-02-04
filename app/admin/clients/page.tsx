import { prisma } from '@/lib/prisma';

export default async function ClientsPage() {
  const clients = await prisma.user.findMany({
    where: {
      isAdmin: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Clients</h1>
      {/* Client list UI here */}
    </div>
  );
} 
import { getServices } from '@/lib/services';
import ProgramDetailClient from './ProgramDetailClient';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    programId: string;
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { programs, users } = await getServices();

  const [program, availableUsers] = await Promise.all([
    programs.getProgramById(params.programId),
    users.getRecentUsers()
  ]);

  if (!program) {
    notFound();
  }

  return (
    <div className="p-6">
      <ProgramDetailClient program={program} availableUsers={availableUsers} />
    </div>
  );
}

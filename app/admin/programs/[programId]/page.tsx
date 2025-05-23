import { getServices } from '@/lib/services';
import ProgramDetailClient from './ProgramDetailClient';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    programId: string;
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { programId } = await params;

  const { programs, users, workouts } = await getServices();

  const [program, availableUsers, workoutsDetails] = await Promise.all([
    programs.getProgramById(programId),
    users.getRecentUsers(),
    workouts.getWorkouts()
  ]);

  console.log('available users', availableUsers);

  if (!program) {
    notFound();
  }

  return (
    <div className="p-6">
      <ProgramDetailClient program={program} workouts={workoutsDetails} />
    </div>
  );
}

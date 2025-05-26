/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServices } from '@/lib/services';
import ProgramDetailClient from './ProgramDetailClient';
import { notFound } from 'next/navigation';

export default async function ProgramDetailPage({ params }: any) {
  const { programs, workouts } = await getServices();

  const [program, workoutsDetails] = await Promise.all([
    programs.getProgramById(params.programId),
    workouts.getWorkouts()
  ]);

  if (!program) {
    notFound();
  }

  return (
    <div className="p-6">
      <ProgramDetailClient program={program} workouts={workoutsDetails} />
    </div>
  );
}

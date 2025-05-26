import { getServices } from '@/lib/services';
import { Metadata } from 'next';
import WorkoutsClient from './WorkoutsClient';

export const metadata: Metadata = {
  title: 'Workout Management',
  description: 'Create and manage workout templates'
};

export default async function AdminWorkoutsPage() {
  const { workouts, exercises } = await getServices();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [workoutsList, availableExercises] = await Promise.all([
    workouts.getWorkouts(),
    exercises.getExercises()
  ]);

  return <WorkoutsClient exercises={availableExercises} />;
}

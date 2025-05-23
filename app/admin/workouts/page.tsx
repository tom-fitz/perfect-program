import { getServices } from '@/lib/services';
import { Metadata } from 'next';
import WorkoutsClient from './WorkoutsClient';

export const metadata: Metadata = {
  title: 'Workout Management',
  description: 'Create and manage workout templates'
};

export default async function AdminWorkoutsPage() {
  const { workouts, exercises } = await getServices();
  const [allWorkouts, availableExercises] = await Promise.all([
    workouts.getWorkouts(),
    exercises.getExercises()
  ]);

  return (
    <WorkoutsClient workouts={allWorkouts} exercises={availableExercises} />
  );
}

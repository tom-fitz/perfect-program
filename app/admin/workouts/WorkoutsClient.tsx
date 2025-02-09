'use client';

import { useRouter } from 'next/navigation';
import NewWorkoutButton from '@/components/workouts/NewWorkoutButton';
import { Exercise, Workout } from '@prisma/client';
import { WorkoutWithDetails } from '@/types/workouts';

type WorkoutsClientProps = {
  workouts: WorkoutWithDetails[];
  exercises: Exercise[];
};

export default function WorkoutsClient({ workouts, exercises }: WorkoutsClientProps) {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Workout Management</h1>
            <p className="text-gray-400">
              Create and manage workout templates for your programs
            </p>
          </div>
          <NewWorkoutButton 
            exercises={exercises} 
            onWorkoutCreated={() => {
              router.refresh();
            }} 
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Difficulty, Exercise } from '@prisma/client';
import { createWorkout } from '@/lib/actions/workouts';
import NewWorkoutModal from './NewWorkoutModal';
import { WorkoutWithDetails } from '@/types/workouts';

interface NewWorkoutButtonProps {
  exercises: Exercise[];
  onWorkoutCreated: (workout: WorkoutWithDetails) => void;
}

export default function NewWorkoutButton({
  exercises,
  onWorkoutCreated
}: NewWorkoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    duration: number;
    difficulty: Difficulty;
    exercises: {
      exerciseId: string;
      sets: number;
      reps?: number;
      duration?: number;
      order: number;
      notes?: string;
      restPeriod: number;
    }[];
  }) => {
    try {
      const result = await createWorkout(data);

      if (result.success) {
        setIsOpen(false);
        onWorkoutCreated(result.data);
      } else {
        console.error('Failed to create workout:', result.error);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors"
      >
        <Plus size={20} />
        New Workout
      </button>

      <NewWorkoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        exercises={exercises}
      />
    </>
  );
}

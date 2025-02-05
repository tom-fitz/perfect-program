'use server';

import { getServices } from '@/lib/services';
import { revalidatePath } from 'next/cache';
import { Difficulty } from '@prisma/client';
import { WorkoutWithDetails } from '@/types/workouts';

export async function createWorkout(data: {
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
}): Promise<
  | { success: true; data: WorkoutWithDetails }
  | { success: false; error: string }
> {
  try {
    const { workouts } = await getServices();
    const workout = await workouts.createWorkout(data);
    revalidatePath('/admin/workouts');
    return { success: true, data: workout as WorkoutWithDetails };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create workout'
    };
  }
}

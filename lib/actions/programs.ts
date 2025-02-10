'use server';

import { getServices } from '@/lib/services';
import { revalidatePath } from 'next/cache';
import { Difficulty } from '@prisma/client';

export async function createProgram(data: {
  name: string;
  description: string;
  duration: number;
  difficulty: Difficulty;
  workouts: {
    workoutId: string;
    weekNumber: number;
    dayNumber: number;
    order: number;
  }[];
}) {
  try {
    const { programs } = await getServices();
    const program = await programs.createProgram(data);
    revalidatePath('/admin/programs');
    return { success: true, data: program };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create program'
    };
  }
}

export async function assignProgramToUser(programId: string, userId: string) {
  try {
    const { programs } = await getServices();
    await programs.assignProgramToUser(programId, userId);
    revalidatePath('/admin/programs');
    revalidatePath(`/app/users/${userId}`);
    return { success: true };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign program'
    };
  }
}

export async function updateWorkoutOrder(programId: string, workouts: {
  workoutId: string;
  weekNumber: number;
  dayNumber: number;
  order: number;
}[]) {
  try {
    const { programs } = await getServices();
    await programs.updateWorkoutOrder(programId, workouts);
    revalidatePath(`/admin/programs/${programId}`);
    return { success: true };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update workout order'
    };
  }
}

export async function addWorkoutToProgram(programId: string, data: {
  workoutId: string;
  weekNumber: number;
  dayNumber: number;
  order: number;
}) {
  try {
    const { programs } = await getServices();
    await programs.addWorkoutToProgram(programId, data);
    revalidatePath(`/admin/programs/${programId}`);
    return { success: true };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add workout'
    };
  }
}

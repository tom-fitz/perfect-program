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

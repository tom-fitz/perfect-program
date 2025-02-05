'use server';

import { getServices } from '@/lib/services';
import { revalidatePath } from 'next/cache';
import { Difficulty } from '@prisma/client';

export async function createExercise(data: {
  name: string;
  description: string;
  videoUrl: string;
  bodyPartId: string;
  equipmentIds: string[];
  typeId: string;
  difficulty: Difficulty;
}) {
  try {
    const { exercises } = await getServices();
    const exercise = await exercises.createExercise(data);
    revalidatePath('/admin/exercises');
    revalidatePath('/app/exercises');
    return { success: true, data: exercise };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create exercise'
    };
  }
}

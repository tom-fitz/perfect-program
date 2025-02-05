'use server';

import { getServices } from "@/lib/services";
import { revalidatePath } from "next/cache";
import { Difficulty } from "@prisma/client";

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
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { 
      success: false, 
      error: error.message || 'Failed to create exercise' 
    };
  }
} 
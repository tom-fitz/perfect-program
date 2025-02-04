'use server';

import { getServices } from "@/lib/services";
import { revalidatePath } from "next/cache";

export async function createExercise(data: { 
  name: string; 
  description: string; 
  videoUrl: string 
}) {
  try {
    const { exercises } = await getServices();
    const exercise = await exercises.createExercise(data);
    revalidatePath('/admin/exercises');
    revalidatePath('/app/exercises');
    return { success: true, data: exercise };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to create exercise' 
    };
  }
} 
import { Exercise, Workout } from '@prisma/client';

export type WorkoutWithDetails = Workout & {
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: number | null;
    duration: number | null;
    order: number;
    notes: string | null;
    restPeriod: number;
  }[];
};

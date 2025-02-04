import { prisma } from '@/lib/prisma';

export default async function WorkoutsPage() {
  const workouts = await prisma.workout.findMany({
    include: {
      exercises: {
        include: {
          exercise: true
        }
      }
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Workout Programs</h1>
      {/* Workout management UI here */}
    </div>
  );
} 
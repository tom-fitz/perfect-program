import { getServices } from '@/lib/services';
import { Metadata } from 'next';
import WorkoutsClient from './WorkoutsClient';
import NewWorkoutButton from '@/components/workouts/NewWorkoutButton';

export const metadata: Metadata = {
  title: 'Workout Management',
  description: 'Create and manage workout templates'
};

export default async function AdminWorkoutsPage() {
  const { workouts, exercises } = await getServices();
  const [allWorkouts, availableExercises, totalWorkouts] = await Promise.all([
    workouts.getWorkouts(),
    exercises.getExercises(),
    workouts.getTotalWorkouts()
  ]);

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
          <NewWorkoutButton exercises={availableExercises} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkoutsClient
            initialWorkouts={allWorkouts}
            exercises={availableExercises}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-ebony p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 p-3 rounded">
                <div className="text-2xl font-bold">{totalWorkouts}</div>
                <div className="text-sm text-gray-400">Total Workouts</div>
              </div>
              <div className="bg-black/20 p-3 rounded">
                <div className="text-2xl font-bold">
                  {availableExercises.length}
                </div>
                <div className="text-sm text-gray-400">Available Exercises</div>
              </div>
            </div>
          </div>

          <div className="bg-ebony p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Exercise Structure</h2>
            <div className="text-sm text-gray-400">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-sunglow rounded-full"></span>
                Sets determine repetition blocks
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-powder rounded-full"></span>
                Reps or duration per set
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Rest periods between sets
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { getServices } from '@/lib/services';
import ProgramsClient from './ProgramsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program Management',
  description: 'Create and manage workout programs'
};

export default async function AdminProgramsPage() {
  const { programs, workouts } = await getServices();
  const [allPrograms, availableWorkouts] = await Promise.all([
    programs.getPrograms(),
    workouts.getWorkouts()
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Program Management</h1>
        <p className="text-gray-400">
          Create and manage workout programs for your clients
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgramsClient
            initialPrograms={allPrograms}
            workouts={availableWorkouts}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-ebony p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 p-3 rounded">
                <div className="text-2xl font-bold">{allPrograms.length}</div>
                <div className="text-sm text-gray-400">Total Programs</div>
              </div>
              <div className="bg-black/20 p-3 rounded">
                <div className="text-2xl font-bold">
                  {availableWorkouts.length}
                </div>
                <div className="text-sm text-gray-400">Available Workouts</div>
              </div>
            </div>
          </div>

          <div className="bg-ebony p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Program Hierarchy</h2>
            <div className="text-sm text-gray-400">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-sunglow rounded-full"></span>
                Programs contain multiple workouts
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-powder rounded-full"></span>
                Workouts contain multiple exercises
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Exercises are individual movements
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

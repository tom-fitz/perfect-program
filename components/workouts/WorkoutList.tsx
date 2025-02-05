'use client';

import { WorkoutWithDetails } from '@/types/workouts';
import { Clock, Dumbbell } from 'lucide-react';
import Link from 'next/link';

interface WorkoutListProps {
  workouts: WorkoutWithDetails[];
}

export default function WorkoutList({ workouts }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-12 bg-ebony/20 rounded-lg">
        <p className="text-gray-400">No workouts found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {workouts.map((workout) => (
        <div key={workout.id} className="bg-ebony/40 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-powder">
                {workout.name}
              </h3>
              <p className="text-sm text-gray-400">{workout.description}</p>
            </div>
            {/* <span className="px-2 py-1 text-xs rounded bg-gray-800 text-powder">
              {workout.difficulty}
            </span> */}
          </div>

          <div className="flex gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {workout.duration} min
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell size={16} />
              {workout.exercises.length} exercises
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <Link
              href={`/admin/workouts/${workout.id}`}
              className="text-sm text-powder hover:text-sunglow transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

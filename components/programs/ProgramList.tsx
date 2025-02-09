'use client';

import { Program, Workout, User } from '@prisma/client';
import { Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ProgramWithDetails = Program & {
  workouts: {
    workout: Workout;
    weekNumber: number;
    dayNumber: number;
    order: number;
  }[];
  assignedTo: User[];
};

interface ProgramListProps {
  programs: ProgramWithDetails[];
}

export default function ProgramList({ programs }: ProgramListProps) {
  const router = useRouter();

  if (programs.length === 0) {
    return (
      <div className="text-center py-12 bg-ebony/20 rounded-lg">
        <p className="text-gray-400">No programs found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {programs.map((program) => (
        <div key={program.id} className="bg-ebony/40 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-powder">
                {program.name}
              </h3>
              <p className="text-sm text-gray-400">{program.description}</p>
            </div>
            <span className="px-2 py-1 text-xs rounded bg-gray-800 text-powder">
              {program.difficulty}
            </span>
          </div>

          <div className="flex gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {program.duration} weeks
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              {program.assignedTo.length} users
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <button
              onClick={() => router.push(`/admin/programs/${program.id}`)}
              className="text-sm text-powder hover:text-sunglow transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

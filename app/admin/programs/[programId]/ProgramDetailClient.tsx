'use client';

import { useState } from 'react';
import { Program, User, Workout } from '@prisma/client';
import { assignProgramToUser } from '@/lib/actions/programs';

type ProgramWithDetails = Program & {
  workouts: {
    workout: Workout;
    weekNumber: number;
    dayNumber: number;
    order: number;
  }[];
  assignedTo: User[];
};

interface Props {
  program: ProgramWithDetails;
  availableUsers: User[];
}

export default function ProgramDetailClient({
  program,
  availableUsers
}: Props) {
  const [selectedUser, setSelectedUser] = useState('');

  const handleAssign = async () => {
    if (!selectedUser) return;
    const result = await assignProgramToUser(program.id, selectedUser);
    if (result.success) {
      setSelectedUser('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-powder">{program.name}</h1>
          <p className="text-gray-400">{program.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-black/20 border border-gray-800 rounded px-3 py-2 text-powder"
          >
            <option value="">Select User</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={!selectedUser}
            className="px-4 py-2 bg-sunglow text-ebony rounded-lg disabled:opacity-50"
          >
            Assign Program
          </button>
        </div>
      </div>

      {/* Program Schedule */}
      <div className="bg-ebony p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Program Schedule</h2>
        {Array.from({ length: program.duration }).map((_, weekIndex) => (
          <div key={weekIndex} className="mb-6">
            <h3 className="text-lg font-medium mb-2">Week {weekIndex + 1}</h3>
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const workouts = program.workouts.filter(
                  (w) =>
                    w.weekNumber === weekIndex + 1 &&
                    w.dayNumber === dayIndex + 1
                );

                return (
                  <div key={dayIndex} className="bg-black/20 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      {
                        [
                          'Monday',
                          'Tuesday',
                          'Wednesday',
                          'Thursday',
                          'Friday',
                          'Saturday',
                          'Sunday'
                        ][dayIndex]
                      }
                    </div>
                    {workouts.map((w) => (
                      <div key={w.workout.id} className="text-sm text-gray-400">
                        {w.workout.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

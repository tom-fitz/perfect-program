'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import NewProgramButton from '@/components/programs/NewProgramButton';
import ProgramList from '@/components/programs/ProgramList';
import { Program, Workout, User } from '@prisma/client';

type ProgramWithDetails = Program & {
  workouts: {
    workout: Workout;
    weekNumber: number;
    dayNumber: number;
    order: number;
  }[];
  assignedTo: User[];
};

interface ProgramsClientProps {
  initialPrograms: ProgramWithDetails[];
  workouts: Workout[];
}

export default function ProgramsClient({
  initialPrograms,
  workouts
}: ProgramsClientProps) {
  const [programs] = useState(initialPrograms);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-powder">Program Management</h1>
        <NewProgramButton workouts={workouts} />
      </div>

      <div className="bg-ebony p-4 rounded-lg shadow space-y-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-powder"
          />
        </div>

        <ProgramList programs={programs} />
      </div>
    </div>
  );
}

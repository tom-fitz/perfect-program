'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Exercise } from '@prisma/client';
import WorkoutList from '@/components/workouts/WorkoutList';
import { WorkoutWithDetails } from '@/types/workouts';

interface WorkoutsClientProps {
  initialWorkouts: WorkoutWithDetails[];
  exercises: Exercise[];
}

export default function WorkoutsClient({
  initialWorkouts,
}: WorkoutsClientProps) {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      if (!term.trim()) {
        setWorkouts(initialWorkouts);
        return;
      }

      const filtered = initialWorkouts.filter(
        (workout) =>
          workout.name.toLowerCase().includes(term.toLowerCase()) ||
          workout.description?.toLowerCase().includes(term.toLowerCase())
      );
      setWorkouts(filtered);
    },
    [initialWorkouts]
  );

  return (
    <div className="space-y-6">
      <div className="bg-ebony p-4 rounded-lg shadow space-y-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-powder"
          />
        </div>

        <WorkoutList workouts={workouts} />
      </div>
    </div>
  );
}

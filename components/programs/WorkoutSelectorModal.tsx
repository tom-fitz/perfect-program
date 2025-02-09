'use client';

import { Workout } from '@prisma/client';
import { useState } from 'react';
import { Check, Search, X } from 'lucide-react';

interface WorkoutSelectorModalProps {
  workouts: Workout[];
  onSelect: (workoutIds: string[]) => void;
  onClose: () => void;
}

export default function WorkoutSelectorModal({
  workouts,
  onSelect,
  onClose
}: WorkoutSelectorModalProps) {
  const [selectedWorkouts, setSelectedWorkouts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = async () => {
    await onSelect(Array.from(selectedWorkouts));
    onClose();
    setSelectedWorkouts(new Set()); // Reset selections after adding
  };

  const toggleWorkout = (workoutId: string) => {
    const newSelected = new Set(selectedWorkouts);
    if (newSelected.has(workoutId)) {
      newSelected.delete(workoutId);
    } else {
      newSelected.add(workoutId);
    }
    setSelectedWorkouts(newSelected);
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-ebony p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-powder">Select Workouts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-powder">
            <X size={24} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 pl-10 text-powder"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              onClick={() => toggleWorkout(workout.id)}
              className={`p-4 rounded-lg cursor-pointer transition-colors bg-black/20 border ${
                selectedWorkouts.has(workout.id)
                  ? 'border-sunglow'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-powder">{workout.name}</h3>
                {selectedWorkouts.has(workout.id) && (
                  <Check className="text-sunglow ml-2" size={18} />
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{workout.description}</p>
            </div>
          ))}
          {filteredWorkouts.length === 0 && (
            <div className="col-span-2 text-center py-4 text-gray-400">
              No workouts found
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-powder"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90"
            disabled={selectedWorkouts.size === 0}
          >
            Add Selected ({selectedWorkouts.size})
          </button>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { Program, User, Workout } from '@prisma/client';
import { Plus, Save, ChevronUp, ChevronDown } from 'lucide-react';
import WorkoutSelectorModal from '@/components/programs/WorkoutSelectorModal';
import { WorkoutWithDetails } from '@/types/workouts';
import { updateWorkoutOrder } from '@/lib/actions/programs';

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
  workouts: WorkoutWithDetails[];
}

export default function ProgramDetailClient({ program: initialProgram, availableUsers, workouts }: Props) {
  const [program, setProgram] = useState(initialProgram);
  const [selectedDay, setSelectedDay] = useState<{week: number, day: number} | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const moveWorkout = (weekNumber: number, dayNumber: number, currentIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const dayWorkouts = program.workouts.filter(
      w => w.weekNumber === weekNumber && w.dayNumber === dayNumber
    ).sort((a, b) => a.order - b.order);

    if (newIndex < 0 || newIndex >= dayWorkouts.length) return;

    const newWorkouts = program.workouts.map(w => {
      if (w.weekNumber === weekNumber && w.dayNumber === dayNumber) {
        if (w.order === currentIndex) return { ...w, order: newIndex };
        if (w.order === newIndex) return { ...w, order: currentIndex };
      }
      return w;
    });

    setProgram(prev => ({ ...prev, workouts: newWorkouts }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const result = await updateWorkoutOrder(
      program.id,
      program.workouts.map(w => ({
        id: w.workout.id,
        weekNumber: w.weekNumber,
        dayNumber: w.dayNumber,
        order: w.order
      }))
    );

    if (result.success) {
      setHasChanges(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-powder">{program.name}</h1>
        {hasChanges && (
          <button onClick={handleSave} className="px-4 py-2 bg-sunglow text-ebony rounded-lg">
            Save Changes
          </button>
        )}
      </div>

      <div className="bg-ebony rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-800">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-3 text-sm font-medium text-center">{day}</div>
          ))}
        </div>

        {Array.from({ length: program.duration }).map((_, week) => (
          <div key={week} className="grid grid-cols-7">
            {Array.from({ length: 7 }).map((_, day) => {
              const dayWorkouts = program.workouts.filter(
                w => w.weekNumber === week + 1 && w.dayNumber === day + 1
              ).sort((a, b) => a.order - b.order);

              return (
                <div key={`${week + 1}-${day + 1}`} className="min-h-[120px] p-2 border border-gray-800 relative group">
                  <button 
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                    onClick={() => setSelectedDay({ week: week + 1, day: day + 1 })}
                  >
                    <Plus className="w-4 h-4 text-gray-400 hover:text-powder" />
                  </button>

                  <div className="mt-6 space-y-1">
                    {dayWorkouts.map((workout, index) => (
                      <div key={workout.workout.id} className="bg-black/30 p-2 rounded flex items-center justify-between">
                        <span>{workout.workout.name}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveWorkout(week + 1, day + 1, index, 'up')}
                            className="opacity-0 group-hover:opacity-100 hover:text-powder"
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveWorkout(week + 1, day + 1, index, 'down')}
                            className="opacity-0 group-hover:opacity-100 hover:text-powder"
                            disabled={index === dayWorkouts.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedDay && (
        <WorkoutSelectorModal
          workouts={workouts}
          onSelect={(workoutIds) => {
            setSelectedDay(null);
          }}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

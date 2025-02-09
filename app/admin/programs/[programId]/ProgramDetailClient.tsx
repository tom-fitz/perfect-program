'use client';

import { useState, useMemo } from 'react';
import { Program, User, Workout } from '@prisma/client';
import { assignProgramToUser, updateWorkoutOrder, addWorkoutToProgram } from '@/lib/actions/programs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Trash2 } from 'lucide-react';
import WorkoutSelectorModal from '@/components/programs/WorkoutSelectorModal';
import { WorkoutWithDetails } from '@/types/workouts';

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

export default function ProgramDetailClient({
  program: initialProgram,
  availableUsers,
  workouts
}: Props) {
  const [program, setProgram] = useState(initialProgram);
  const [selectedUser, setSelectedUser] = useState('');
  const [weeks, setWeeks] = useState(program.duration || 0);
  const [selectedDay, setSelectedDay] = useState<{week: number, day: number} | null>(null);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    if (result.source.droppableId !== result.destination.droppableId) return;
    
    const [sourceWeek, sourceDay] = result.source.droppableId.split('-');
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const updatedWorkouts = [...program.workouts];
    const dayWorkouts = updatedWorkouts.filter(
      w => w.weekNumber === parseInt(sourceWeek) + 1 && 
           w.dayNumber === parseInt(sourceDay) + 1
    );

    const [movedWorkout] = dayWorkouts.splice(sourceIndex, 1);
    dayWorkouts.splice(destinationIndex, 0, movedWorkout);

    dayWorkouts.forEach((workout, index) => {
      workout.order = index;
    });

    await updateWorkoutOrder(program.id, dayWorkouts.map(w => ({
      id: w.workout.id,
      weekNumber: w.weekNumber,
      dayNumber: w.dayNumber,
      order: w.order
    })));
  };

  const handleAssign = async () => {
    if (!selectedUser) return;
    const result = await assignProgramToUser(program.id, selectedUser);
    if (result.success) {
      setSelectedUser('');
    }
  };

  const handleAddWorkouts = async (workoutIds: string[]) => {
    if (!selectedDay) return;
    
    const updatedWorkouts = [...program.workouts];
    
    // Add each workout sequentially
    for (const workoutId of workoutIds) {
      const order = program.workouts.filter(
        w => w.weekNumber === selectedDay.week && w.dayNumber === selectedDay.day
      ).length;

      const result = await addWorkoutToProgram(program.id, {
        workoutId,
        weekNumber: selectedDay.week,
        dayNumber: selectedDay.day,
        order
      });

      if (result.success) {
        updatedWorkouts.push({
          workout: workouts.find(w => w.id === workoutId)!,
          weekNumber: selectedDay.week,
          dayNumber: selectedDay.day,
          order
        });
      }
    }
    
    setProgram(prev => ({
      ...prev,
      workouts: updatedWorkouts
    }));
    
    setSelectedDay(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-powder">{program.name}</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-black/20 border border-gray-800 rounded px-3 py-2 text-powder"
          >
            <option value="">Assign to User</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="bg-ebony rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-800">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <div key={day} className="p-3 text-sm font-medium text-center border-r border-gray-800 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-800 last:border-b-0">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const dayWorkouts = program.workouts.filter(
                  w => w.weekNumber === weekIndex + 1 && w.dayNumber === dayIndex + 1
                );

                return (
                  <Droppable droppableId={`${weekIndex}-${dayIndex}`} key={dayIndex} type="workout" isDropDisabled={false}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[120px] p-2 border-r border-gray-800 last:border-r-0 relative group"
                        onClick={() => setSelectedDay({ week: weekIndex + 1, day: dayIndex + 1 })}
                      >
                        {dayWorkouts.map((workout, index) => (
                          <Draggable
                            key={workout.workout.id}
                            draggableId={workout.workout.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-black/30 p-2 rounded mb-1 text-sm"
                              >
                                {workout.workout.name}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        <button 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay({ week: weekIndex + 1, day: dayIndex + 1 });
                          }}
                        >
                          <Plus className="w-4 h-4 text-gray-400 hover:text-powder" />
                        </button>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Week controls */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setWeeks(w => Math.max(2, w - 1))}
          className="px-3 py-1 text-sm bg-black/20 rounded hover:bg-black/30"
        >
          Remove Week
        </button>
        <button
          onClick={() => setWeeks(w => w + 1)}
          className="px-3 py-1 text-sm bg-black/20 rounded hover:bg-black/30"
        >
          Add Week
        </button>
      </div>

      {/* Workout Selector Modal */}
      {selectedDay && (
        <WorkoutSelectorModal
          workouts={workouts}
          onSelect={handleAddWorkouts}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

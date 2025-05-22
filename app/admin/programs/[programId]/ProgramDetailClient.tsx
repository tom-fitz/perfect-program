'use client';

import { useState, useEffect, ClassAttributes, HTMLAttributes, JSX, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, Ref, ClassAttributes, HTMLAttributes, JSX, Ref } from 'react';
import { Program, User, Workout } from '@prisma/client';
import { Plus, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import WorkoutSelectorModal from '@/components/programs/WorkoutSelectorModal';
import { WorkoutWithDetails } from '@/types/workouts';
import { updateWorkoutOrder } from '@/lib/actions/programs';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  const router = useRouter();
  const [program, setProgram] = useState(initialProgram);
  const [selectedDay, setSelectedDay] = useState<{week: number, day: number} | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasChanges && !isSaving) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges, isSaving]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

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

  const handleWorkoutSelection = (workoutIds: string[]) => {
    if (!selectedDay) return;

    const currentDayWorkouts = program.workouts.filter(
      w => w.weekNumber === selectedDay.week && w.dayNumber === selectedDay.day
    );

    // Remove any existing workouts for the selected workoutIds
    const filteredWorkouts = program.workouts.filter(w => 
      !(w.weekNumber === selectedDay.week && 
        w.dayNumber === selectedDay.day && 
        workoutIds.includes(w.workout.id))
    );

    const maxOrder = currentDayWorkouts.length > 0 
      ? Math.max(...currentDayWorkouts.map(w => w.order))
      : -1;

    const newWorkouts = [
      ...filteredWorkouts,
      ...workoutIds.map((id, index) => ({
        workout: workouts.find(w => w.id === id)!,
        weekNumber: selectedDay.week,
        dayNumber: selectedDay.day,
        order: maxOrder + 1 + index
      }))
    ];

    setProgram(prev => ({ ...prev, workouts: newWorkouts }));
    setHasChanges(true);
    setSelectedDay(null);
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const result = await updateWorkoutOrder(
        program.id,
        program.workouts.map(w => ({
          workoutId: w.workout.id,
          weekNumber: w.weekNumber,
          dayNumber: w.dayNumber,
          order: w.order
        }))
      );

      if (result.success) {
        setHasChanges(false);
        toast.success('Changes saved successfully');
      } else {
        toast.error('Failed to save changes: ' + result.error);
      }
    } catch (error) {
      toast.error('Error saving changes');
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setProgram(initialProgram);
    setHasChanges(false);
  };

  const getWorkloadClass = (workoutCount: number) => {
    if (workoutCount <= 0) return '';
    if (workoutCount <= 1) return 'bg-sunglow/25';
    if (workoutCount <= 2) return 'bg-sunglow/40';
    if (workoutCount <= 3) return 'bg-sunglow/60';
    if (workoutCount <= 5) return 'bg-sunglow/80';
    if (workoutCount <= 7) return 'bg-sunglow/100';
    return 'bg-sunglow/80';
  };

  const calculateDayDuration = (workouts: typeof program.workouts) => {
    return workouts.reduce((total, w) => total + (w.workout.duration || 0), 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-powder">{program.name}</h1>
          {hasChanges && (
            <span className="text-sm px-2 py-1 bg-sunglow/20 text-sunglow rounded-md">
              Pending Changes
            </span>
          )}
        </div>
        <p className="text-powder/80">{program.description}</p>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 bg-sunglow hover:bg-sunglow/90 text-ebony rounded-lg flex items-center gap-2 transition-colors ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-powder rounded-lg flex items-center gap-2 transition-colors"
            >
              Reset Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-ebony rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-sm font-medium text-center">{day}</div>
          ))}
        </div>

        <DragDropContext
          onDragEnd={(result: { source: any; destination: any; }) => {
            const { source, destination } = result;
            if (!destination) return;

            const sourceWeek = parseInt(source.droppableId.split('-')[1]);
            const sourceDay = parseInt(source.droppableId.split('-')[2]);
            const destWeek = parseInt(destination.droppableId.split('-')[1]);
            const destDay = parseInt(destination.droppableId.split('-')[2]);

            const sourceWorkouts = program.workouts.filter(
              w => w.weekNumber === sourceWeek && w.dayNumber === sourceDay
            );
            const destWorkouts = program.workouts.filter(
              w => w.weekNumber === destWeek && w.dayNumber === destDay
            );

            const [moved] = sourceWorkouts.splice(source.index, 1);
            destWorkouts.splice(destination.index, 0, moved);

            const newWorkouts = program.workouts.map(w => {
              if (w.weekNumber === sourceWeek && w.dayNumber === sourceDay) {
                const newIndex = sourceWorkouts.findIndex(dw => dw.workout.id === w.workout.id);
                return { ...w, order: newIndex };
              }
              if (w.weekNumber === destWeek && w.dayNumber === destDay) {
                const newIndex = destWorkouts.findIndex(dw => dw.workout.id === w.workout.id);
                return { ...w, order: newIndex };
              }
              return w;
            });

            setProgram(prev => ({ ...prev, workouts: newWorkouts }));
            setHasChanges(true);
          }}
        >
          {Array.from({ length: program.duration }).map((_, week) => (
            <div key={`week-${week}`} className="grid grid-cols-7">
              {Array.from({ length: 7 }).map((_, day) => {
                const dayWorkouts = program.workouts.filter(
                  w => w.weekNumber === week + 1 && w.dayNumber === ((day + 1) % 7 || 7)
                ).sort((a, b) => a.order - b.order);

                const totalDuration = calculateDayDuration(dayWorkouts);

                return (
                  <Droppable droppableId={`week-${week + 1}-day-${((day + 1) % 7 || 7)}`} key={`${week + 1}-${day + 1}`}>
                    {(provided: { innerRef: Ref<HTMLDivElement> | undefined; droppableProps: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>; placeholder: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[120px] p-2 border border-gray-800 relative group ${
                          getWorkloadClass(dayWorkouts.length)
                        }`}
                      >
                        {totalDuration > 0 && (
                          <div className="absolute text-l font-bold top-1 left-1 text-gray-400">
                            {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                          </div>
                        )}
                        <button
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                          onClick={() => setSelectedDay({ week: week + 1, day: ((day + 1) % 7 || 7) })}
                        >
                          <Plus className="w-4 h-4 text-gray-400 hover:text-powder" />
                        </button>

                        <div className="mt-6 space-y-1">
                          {dayWorkouts.map((workout, index) => (
                            <Draggable key={workout.workout.id} draggableId={workout.workout.id} index={index}>
                              {(provided: { innerRef: Ref<HTMLDivElement> | undefined; draggableProps: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>; dragHandleProps: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>; }) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-ebony p-1.5 rounded flex flex-col gap-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{workout.workout.name}</span>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => moveWorkout(week + 1, ((day + 1) % 7 || 7), index, 'up')}
                                        className="opacity-0 group-hover:opacity-100 hover:text-powder"
                                        disabled={index === 0}
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => moveWorkout(week + 1, ((day + 1) % 7 || 7), index, 'down')}
                                        className="opacity-0 group-hover:opacity-100 hover:text-powder"
                                        disabled={index === dayWorkouts.length - 1}
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap">
                                    {workout.workout.description && (
                                      <span className="text-xs px-1.5 py-0.5 bg-gray-800 text-gray-300">
                                        {workout.workout.description}
                                      </span>
                                    )}
                                    {workout.workout.duration && (
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">
                                        {Math.floor(workout.workout.duration / 60)}:{(workout.workout.duration % 60).toString().padStart(2, '0')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          ))}
        </DragDropContext>
      </div>

      {selectedDay && (
        <WorkoutSelectorModal
          workouts={workouts}
          onSelect={handleWorkoutSelection}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

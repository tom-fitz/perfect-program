'use client';

import { useState, useEffect, useCallback } from 'react';
import { Program, User, Workout } from '@prisma/client';
import { Plus, Save, ChevronUp, ChevronDown } from 'lucide-react';
import WorkoutSelectorModal from '@/components/programs/WorkoutSelectorModal';
import { WorkoutWithDetails } from '@/types/workouts';
import { updateWorkoutOrder } from '@/lib/actions/programs';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  workouts: WorkoutWithDetails[];
}

export default function ProgramDetailClient({ program: initialProgram, workouts }: Props) {
  const [program, setProgram] = useState(initialProgram);
  const [selectedDay, setSelectedDay] = useState<{
    week: number;
    day: number;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const result = await updateWorkoutOrder(
        program.id,
        program.workouts.map((w) => ({
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
  }, [program.id, program.workouts, isSaving]);

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
  }, [hasChanges, isSaving, handleSave]);

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

  const moveWorkout = (
    weekNumber: number,
    dayNumber: number,
    currentIndex: number,
    direction: 'up' | 'down'
  ) => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const dayWorkouts = program.workouts
      .filter((w) => w.weekNumber === weekNumber && w.dayNumber === dayNumber)
      .sort((a, b) => a.order - b.order);

    if (newIndex < 0 || newIndex >= dayWorkouts.length) return;

    const newWorkouts = program.workouts.map((w) => {
      if (w.weekNumber === weekNumber && w.dayNumber === dayNumber) {
        if (w.order === currentIndex) return { ...w, order: newIndex };
        if (w.order === newIndex) return { ...w, order: currentIndex };
      }
      return w;
    });

    setProgram((prev) => ({ ...prev, workouts: newWorkouts }));
    setHasChanges(true);
  };

  const handleWorkoutSelection = (workoutIds: string[]) => {
    if (!selectedDay) return;

    const currentDayWorkouts = program.workouts.filter(
      (w) =>
        w.weekNumber === selectedDay.week && w.dayNumber === selectedDay.day
    );

    // Remove any existing workouts for the selected workoutIds
    const filteredWorkouts = program.workouts.filter(
      (w) =>
        !(
          w.weekNumber === selectedDay.week &&
          w.dayNumber === selectedDay.day &&
          workoutIds.includes(w.workout.id)
        )
    );

    const maxOrder =
      currentDayWorkouts.length > 0
        ? Math.max(...currentDayWorkouts.map((w) => w.order))
        : -1;

    const newWorkouts = [
      ...filteredWorkouts,
      ...workoutIds.map((id, index) => ({
        workout: workouts.find((w) => w.id === id)!,
        weekNumber: selectedDay.week,
        dayNumber: selectedDay.day,
        order: maxOrder + 1 + index
      }))
    ];

    setProgram((prev) => ({ ...prev, workouts: newWorkouts }));
    setHasChanges(true);
    setSelectedDay(null);
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function SortableWorkout({
    workout,
    weekNumber,
    dayNumber,
    index,
    onMove
  }: {
    workout: (typeof program.workouts)[0];
    weekNumber: number;
    dayNumber: number;
    index: number;
    onMove: (
      week: number,
      day: number,
      currentIndex: number,
      direction: 'up' | 'down'
    ) => void;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: workout.workout.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-ebony p-1.5 rounded flex flex-col gap-1"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{workout.workout.name}</span>
          <div className="flex gap-1">
            <button
              onClick={() => onMove(weekNumber, dayNumber, index, 'up')}
              className="opacity-0 group-hover:opacity-100 hover:text-powder"
              disabled={index === 0}
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => onMove(weekNumber, dayNumber, index, 'down')}
              className="opacity-0 group-hover:opacity-100 hover:text-powder"
              disabled={index === -1}
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
              {Math.floor(workout.workout.duration / 60)}:
              {(workout.workout.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
    );
  }

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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-sm font-medium text-center">
              {day}
            </div>
          ))}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event: DragEndEvent) => {
            const { active, over } = event;
            if (!over) return;

            const [sourceWeek, sourceDay] = active.id
              .toString()
              .split('-')
              .map(Number);
            const [destWeek, destDay] = over.id
              .toString()
              .split('-')
              .map(Number);

            const sourceWorkouts = program.workouts
              .filter(
                (w) => w.weekNumber === sourceWeek && w.dayNumber === sourceDay
              )
              .sort((a, b) => a.order - b.order);
            const destWorkouts = program.workouts
              .filter(
                (w) => w.weekNumber === destWeek && w.dayNumber === destDay
              )
              .sort((a, b) => a.order - b.order);

            const oldIndex = sourceWorkouts.findIndex(
              (w) => w.workout.id === active.id
            );
            const newIndex = destWorkouts.findIndex(
              (w) => w.workout.id === over.id
            );

            const newWorkouts = arrayMove(
              sourceWorkouts,
              oldIndex,
              newIndex
            ).map((w, i) => ({
              ...w,
              weekNumber: destWeek,
              dayNumber: destDay,
              order: i
            }));

            setProgram((prev) => ({
              ...prev,
              workouts: [
                ...prev.workouts.filter(
                  (w) =>
                    !(w.weekNumber === sourceWeek && w.dayNumber === sourceDay)
                ),
                ...newWorkouts
              ]
            }));
            setHasChanges(true);
          }}
        >
          {Array.from({ length: program.duration }).map((_, week) => (
            <div key={`week-${week}`} className="grid grid-cols-7">
              {Array.from({ length: 7 }).map((_, day) => {
                const dayWorkouts = program.workouts
                  .filter(
                    (w) =>
                      w.weekNumber === week + 1 &&
                      w.dayNumber === ((day + 1) % 7 || 7)
                  )
                  .sort((a, b) => a.order - b.order);

                const totalDuration = calculateDayDuration(dayWorkouts);

                return (
                  <SortableContext
                    key={`${week + 1}-${day + 1}`}
                    items={dayWorkouts.map((w) => w.workout.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      className={`min-h-[120px] p-2 border border-gray-800 relative group ${getWorkloadClass(
                        dayWorkouts.length
                      )}`}
                    >
                      {totalDuration > 0 && (
                        <div className="absolute text-l font-bold top-1 left-1 text-gray-400">
                          {Math.floor(totalDuration / 60)}:
                          {(totalDuration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                      <button
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={() =>
                          setSelectedDay({
                            week: week + 1,
                            day: (day + 1) % 7 || 7
                          })
                        }
                      >
                        <Plus className="w-4 h-4 text-gray-400 hover:text-powder" />
                      </button>

                      <div className="mt-6 space-y-1">
                        {dayWorkouts.map((workout, index) => (
                          <SortableWorkout
                            key={workout.workout.id}
                            workout={workout}
                            weekNumber={week + 1}
                            dayNumber={(day + 1) % 7 || 7}
                            index={index}
                            onMove={moveWorkout}
                          />
                        ))}
                      </div>
                    </div>
                  </SortableContext>
                );
              })}
            </div>
          ))}
        </DndContext>
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

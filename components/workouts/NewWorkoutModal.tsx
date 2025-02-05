import { Exercise, Difficulty } from '@prisma/client';
import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { createPortal } from 'react-dom';

interface WorkoutFormData {
  name: string;
  description: string;
  duration: number;
  difficulty: Difficulty;
  exercises: {
    exerciseId: string;
    sets: number;
    reps?: number;
    duration?: number;
    order: number;
    notes?: string;
    restPeriod: number;
  }[];
}

interface NewWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkoutFormData) => Promise<void>;
  exercises: Exercise[];
}

export default function NewWorkoutModal({
  isOpen,
  onClose,
  onSubmit,
  exercises
}: NewWorkoutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    difficulty: 'BEGINNER' as Difficulty,
    exercises: [] as {
      exerciseId: string;
      sets: number;
      reps?: number;
      duration?: number;
      order: number;
      notes?: string;
      restPeriod: number;
    }[]
  });

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseId: '',
          sets: 3,
          reps: 10,
          order: prev.exercises.length,
          restPeriod: 60
        }
      ]
    }));
  };

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  if (!mounted || !isOpen) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-ebony p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Workout</h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-powder" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: parseInt(e.target.value)
                  }))
                }
                className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    difficulty: e.target.value as Difficulty
                  }))
                }
                className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Exercises</label>
              <button
                type="button"
                onClick={addExercise}
                className="text-sm text-powder hover:text-sunglow flex items-center gap-1"
              >
                <Plus size={16} />
                Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {formData.exercises.map((exercise, index) => (
                <div key={index} className="bg-black/20 p-3 rounded">
                  <div className="flex justify-between mb-2">
                    <select
                      value={exercise.exerciseId}
                      onChange={(e) => {
                        const newExercises = [...formData.exercises];
                        newExercises[index] = {
                          ...exercise,
                          exerciseId: e.target.value
                        };
                        setFormData((prev) => ({
                          ...prev,
                          exercises: newExercises
                        }));
                      }}
                      className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                      required
                    >
                      <option value="">Select Exercise</option>
                      {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <Minus size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs mb-1">Sets</label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[index] = {
                            ...exercise,
                            sets: parseInt(e.target.value)
                          };
                          setFormData((prev) => ({
                            ...prev,
                            exercises: newExercises
                          }));
                        }}
                        className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Reps</label>
                      <input
                        type="number"
                        value={exercise.reps || ''}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[index] = {
                            ...exercise,
                            reps: parseInt(e.target.value)
                          };
                          setFormData((prev) => ({
                            ...prev,
                            exercises: newExercises
                          }));
                        }}
                        className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Rest (seconds)
                      </label>
                      <input
                        type="number"
                        value={exercise.restPeriod}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[index] = {
                            ...exercise,
                            restPeriod: parseInt(e.target.value)
                          };
                          setFormData((prev) => ({
                            ...prev,
                            exercises: newExercises
                          }));
                        }}
                        className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors"
          >
            Create Workout
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

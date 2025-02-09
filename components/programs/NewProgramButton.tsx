'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Difficulty, Workout } from '@prisma/client';
import { createProgram } from '@/lib/actions/programs';

interface NewProgramButtonProps {
  workouts: Workout[];
}

export default function NewProgramButton({ workouts }: NewProgramButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 4,
    difficulty: 'BEGINNER' as Difficulty,
    workouts: [] as {
      workoutId: string;
      weekNumber: number;
      dayNumber: number;
      order: number;
    }[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createProgram(formData);
    if (result.success) {
      setIsOpen(false);
      setFormData({
        name: '',
        description: '',
        duration: 4,
        difficulty: 'BEGINNER',
        workouts: []
      });
    }
  };

  const addWorkout = () => {
    setFormData(prev => ({
      ...prev,
      workouts: [
        ...prev.workouts,
        {
          workoutId: '',
          weekNumber: 1,
          dayNumber: 1,
          order: prev.workouts.length
        }
      ]
    }));
  };

  const removeWorkout = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workouts: prev.workouts.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors"
      >
        <Plus size={20} />
        New Program
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-ebony p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Program</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="text-gray-400 hover:text-powder" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration (weeks)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))
                    }
                    min={1}
                    max={52}
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
                      setFormData(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))
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
                  <label className="block text-sm font-medium">Workouts</label>
                  <button
                    type="button"
                    onClick={addWorkout}
                    className="text-sm text-powder hover:text-sunglow flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Workout
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.workouts.map((workout, index) => (
                    <div key={index} className="bg-black/20 p-3 rounded">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-2">
                          <select
                            value={workout.workoutId}
                            onChange={(e) => {
                              const newWorkouts = [...formData.workouts];
                              newWorkouts[index] = {
                                ...workout,
                                workoutId: e.target.value
                              };
                              setFormData(prev => ({
                                ...prev,
                                workouts: newWorkouts
                              }));
                            }}
                            className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                            required
                          >
                            <option value="">Select Workout</option>
                            {workouts.map((w) => (
                              <option key={w.id} value={w.id}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            value={workout.weekNumber}
                            onChange={(e) => {
                              const newWorkouts = [...formData.workouts];
                              newWorkouts[index] = {
                                ...workout,
                                weekNumber: parseInt(e.target.value)
                              };
                              setFormData(prev => ({
                                ...prev,
                                workouts: newWorkouts
                              }));
                            }}
                            min={1}
                            max={formData.duration}
                            placeholder="Week"
                            className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={workout.dayNumber}
                            onChange={(e) => {
                              const newWorkouts = [...formData.workouts];
                              newWorkouts[index] = {
                                ...workout,
                                dayNumber: parseInt(e.target.value)
                              };
                              setFormData(prev => ({
                                ...prev,
                                workouts: newWorkouts
                              }));
                            }}
                            min={1}
                            max={7}
                            placeholder="Day"
                            className="w-full p-2 bg-black/20 border border-gray-800 rounded text-powder"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWorkout(index)}
                          className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors"
              >
                Create Program
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

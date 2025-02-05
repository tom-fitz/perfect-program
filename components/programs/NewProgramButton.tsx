'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Difficulty } from '@prisma/client';
import { createProgram } from '@/lib/actions/programs';

export default function NewProgramButton() {
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
            <h2 className="text-xl font-bold mb-4">Create New Program</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields here */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-sunglow text-ebony rounded-lg"
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

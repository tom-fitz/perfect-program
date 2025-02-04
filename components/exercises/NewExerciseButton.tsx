'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import NewExerciseModal from './NewExerciseModal';
import { createExercise } from '@/lib/actions/exercises';

export default function NewExerciseButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (data: { name: string; description: string; videoUrl: string }) => {
    const result = await createExercise(data);
    
    if (result.success) {
      setIsModalOpen(false);
      // Could add a toast notification here
    } else {
      console.error('Error creating exercise:', result.error);
      // Could show error in UI
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Exercise
      </button>

      <NewExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
} 
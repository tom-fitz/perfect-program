'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import NewExerciseModal from './NewExerciseModal';
import { createExercise } from '@/lib/actions/exercises';
import { Difficulty } from '@prisma/client';

interface ExerciseFormData {
  name: string;
  description: string;
  videoUrl: string;
  bodyPartId: string;
  equipmentIds: string[];
  typeId: string;
  difficulty: Difficulty;
}

interface NewExerciseButtonProps {
  bodyParts: { id: string; name: string }[];
  equipment: { id: string; name: string }[];
  exerciseTypes: { id: string; name: string }[];
}

export default function NewExerciseButton({
  bodyParts,
  equipment,
  exerciseTypes
}: NewExerciseButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (data: ExerciseFormData) => {
    const result = await createExercise(data);
    if (result.success) {
      setIsModalOpen(false);
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
        bodyParts={bodyParts}
        equipment={equipment}
        exerciseTypes={exerciseTypes}
      />
    </>
  );
}

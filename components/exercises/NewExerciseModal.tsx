'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Difficulty } from '@prisma/client';

interface NewExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExerciseFormData) => Promise<void>;
  bodyParts: { id: string; name: string }[];
  equipment: { id: string; name: string }[];
  exerciseTypes: { id: string; name: string }[];
}

interface ExerciseFormData {
  name: string;
  description: string;
  videoUrl: string;
  bodyPartId: string;
  equipmentIds: string[];
  typeId: string;
  difficulty: Difficulty;
}

export default function NewExerciseModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  bodyParts,
  equipment,
  exerciseTypes
}: NewExerciseModalProps) {
  const [formData, setFormData] = useState<ExerciseFormData>({
    name: '',
    description: '',
    videoUrl: '',
    bodyPartId: '',
    equipmentIds: [],
    typeId: '',
    difficulty: 'BEGINNER'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      videoUrl: '',
      bodyPartId: '',
      equipmentIds: [],
      typeId: '',
      difficulty: 'BEGINNER'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-ebony p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-powder">New Exercise</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-powder">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Body Part
            </label>
            <select
              value={formData.bodyPartId}
              onChange={(e) => setFormData(prev => ({ ...prev, bodyPartId: e.target.value }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder"
              required
            >
              <option value="">Select Body Part</option>
              {bodyParts.map(part => (
                <option key={part.id} value={part.id}>
                  {part.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Equipment
            </label>
            <div className="space-y-2">
              {equipment.map(item => (
                <label key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.equipmentIds.includes(item.id)}
                    onChange={(e) => {
                      const newIds = e.target.checked
                        ? [...formData.equipmentIds, item.id]
                        : formData.equipmentIds.filter(id => id !== item.id);
                      setFormData(prev => ({ ...prev, equipmentIds: newIds }));
                    }}
                    className="mr-2"
                  />
                  <span className="text-powder">{item.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Exercise Type
            </label>
            <select
              value={formData.typeId}
              onChange={(e) => setFormData(prev => ({ ...prev, typeId: e.target.value }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder"
              required
            >
              <option value="">Select Type</option>
              {exerciseTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                difficulty: e.target.value as Difficulty 
              }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder"
              required
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Video URL
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder"
              placeholder="YouTube URL"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-powder"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90"
            >
              Create Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
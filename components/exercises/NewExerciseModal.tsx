'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface NewExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; videoUrl: string }) => Promise<void>;
}

export default function NewExerciseModal({ isOpen, onClose, onSubmit }: NewExerciseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    videoUrl: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ name: '', description: '', videoUrl: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-ebony border border-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-powder">Add New Exercise</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-sunglow transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder placeholder-gray-500 focus:outline-none focus:border-sunglow"
              placeholder="Exercise name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder placeholder-gray-500 focus:outline-none focus:border-sunglow min-h-[100px]"
              placeholder="Exercise description"
              required
            />
          </div>

          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-400 mb-1">
              Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              className="w-full bg-black/20 border border-gray-800 rounded-lg px-3 py-2 text-powder placeholder-gray-500 focus:outline-none focus:border-sunglow"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-powder transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors font-medium"
            >
              Create Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
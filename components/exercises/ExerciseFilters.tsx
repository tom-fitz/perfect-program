'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Difficulty } from '@prisma/client';

interface FilterProps {
  bodyParts: { id: string; name: string }[];
  equipment: { id: string; name: string }[];
  exerciseTypes: { id: string; name: string }[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  bodyPart?: string;
  equipment: string[];
  type?: string;
  difficulty?: Difficulty;
}

export default function ExerciseFilters({ 
  bodyParts, 
  onFilterChange 
}: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    equipment: []
  });
  
  const [isOpen, setIsOpen] = useState({
    bodyParts: false,
    equipment: false,
    types: false,
    difficulty: false
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Body Parts Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(prev => ({ ...prev, bodyParts: !prev.bodyParts }))}
          className="px-4 py-2 bg-ebony border border-gray-800 rounded-lg flex items-center gap-2 text-powder hover:border-gray-700"
        >
          Body Part
          <ChevronDown size={16} />
        </button>
        
        {isOpen.bodyParts && (
          <div className="absolute top-full mt-2 w-48 bg-ebony border border-gray-800 rounded-lg shadow-xl z-10">
            {bodyParts.map(part => (
              <button
                key={part.id}
                onClick={() => handleFilterChange({ bodyPart: part.id })}
                className="w-full px-4 py-2 text-left text-powder hover:bg-gray-800 flex items-center justify-between"
              >
                {part.name}
                {filters.bodyPart === part.id && <Check size={16} className="text-sunglow" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Similar dropdowns for Equipment, Type, and Difficulty */}
    </div>
  );
} 
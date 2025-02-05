'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import NewExerciseButton from '@/components/exercises/NewExerciseButton';
import ExerciseList from '@/components/exercises/ExerciseList';
import { Difficulty, Exercise } from '@prisma/client';

type ExerciseWithCreator = Exercise & {
  createdBy: { name: string | null };
  bodyPart: { id: string; name: string };
  equipment: { id: string; name: string }[];
  type: { id: string; name: string };
};

interface ExercisesClientProps {
  initialExercises: ExerciseWithCreator[];
  bodyParts: { id: string; name: string }[];
  equipment: { id: string; name: string }[];
  exerciseTypes: { id: string; name: string }[];
}

export default function ExercisesClient({
  initialExercises,
  bodyParts,
  equipment,
  exerciseTypes
}: ExercisesClientProps) {
  const [exercises, setExercises] = useState(initialExercises);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bodyPart: '',
    type: '',
    difficulty: ''
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = initialExercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(term.toLowerCase()) ||
        (ex.description?.toLowerCase() || '').includes(term.toLowerCase())
    );
    setExercises(filtered);
  };

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyFilters = () => {
    let filtered = initialExercises;

    if (searchTerm) {
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ex.description?.toLowerCase() || '').includes(
            searchTerm.toLowerCase()
          )
      );
    }

    if (filters.bodyPart) {
      filtered = filtered.filter((ex) => ex.bodyPart.id === filters.bodyPart);
    }

    if (filters.type) {
      filtered = filtered.filter((ex) => ex.type.id === filters.type);
    }

    if (filters.difficulty) {
      filtered = filtered.filter((ex) => ex.difficulty === filters.difficulty);
    }

    setExercises(filtered);
  };

  const clearFilters = () => {
    setFilters({
      bodyPart: '',
      type: '',
      difficulty: ''
    });
    setSearchTerm('');
    setExercises(initialExercises);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-powder">
          Exercise Library Management
        </h1>
        <NewExerciseButton
          bodyParts={bodyParts}
          equipment={equipment}
          exerciseTypes={exerciseTypes}
        />
      </div>

      <div className="bg-ebony p-4 rounded-lg shadow space-y-6">
        {/* Full-width search bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-powder"
          />
        </div>

        {/* Filter dropdowns */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={filters.bodyPart}
              className="bg-black/20 border border-gray-800 rounded px-3 py-2 text-powder"
              onChange={(e) => handleFilterChange('bodyPart', e.target.value)}
            >
              <option value="">All Body Parts</option>
              {bodyParts.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.name}
                </option>
              ))}
            </select>

            <select
              value={filters.type}
              className="bg-black/20 border border-gray-800 rounded px-3 py-2 text-powder"
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {exerciseTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <select
              value={filters.difficulty}
              className="bg-black/20 border border-gray-800 rounded px-3 py-2 text-powder"
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">All Difficulties</option>
              {Object.values(Difficulty).map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-400 hover:text-powder transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <ExerciseList exercises={exercises} isAdmin={true} />
      </div>
    </div>
  );
}

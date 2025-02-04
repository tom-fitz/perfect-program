import { Exercise } from "@prisma/client";
import { Video, Pencil, Trash } from "lucide-react";

type ExerciseWithCreator = Exercise & {
  createdBy: { name: string | null };
};

interface ExerciseListProps {
  exercises: ExerciseWithCreator[];
  isAdmin?: boolean;
}

export default function ExerciseList({ 
  exercises,
  isAdmin = false
}: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 bg-ebony/20 rounded-lg">
        <p className="text-gray-400">No exercises found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <div 
          key={exercise.id} 
          className="bg-ebony rounded-lg shadow-md border border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-video bg-black/20 flex items-center justify-center">
            <Video className="w-12 h-12 text-gray-500" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-powder">{exercise.name}</h3>
              {isAdmin && (
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-sunglow transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {exercise.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Added by {exercise.createdBy.name}</span>
              {exercise.videoUrl && (
                <a 
                  href={exercise.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sunglow hover:text-sunglow/80"
                >
                  Watch Video
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
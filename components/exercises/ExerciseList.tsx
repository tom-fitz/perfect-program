'use client';

import { Exercise } from "@prisma/client";
import { Video, X } from "lucide-react";
import YouTube from "react-youtube";
import { useState } from "react";
import { FilterState } from "./ExerciseFilters";

type ExerciseWithCreator = Exercise & {
  createdBy: { name: string | null };
};

interface ExerciseListProps {
  exercises: ExerciseWithCreator[];
  isAdmin?: boolean;
  onFilter?: (filters: FilterState & { search: string }) => Promise<void>;
}

function getYouTubeId(url: string | null) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      // Handle YouTube Shorts
      if (urlObj.pathname.includes('/shorts/')) {
        return urlObj.pathname.split('/shorts/')[1];
      }
      // Handle regular YouTube videos
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  } catch (e) {
    console.error('Invalid URL:', e);
  }
  return null;
}

export default function ExerciseList({ 
  exercises,
}: ExerciseListProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
//   const [_, setSearchTerm] = useState("");

//   const handleSearch = useCallback(
//     async (term: string) => {
//       setSearchTerm(term);
//       if (onFilter) {
//         await onFilter({ search: term, equipment: [] });
//       }
//     },
//     [onFilter]
//   );

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 bg-ebony/20 rounded-lg">
        <p className="text-gray-400">No exercises found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => {
          const videoId = getYouTubeId(exercise.videoUrl);
          const isPlaying = activeVideo === exercise.id;

          return (
            <div 
              key={exercise.id} 
              className="bg-ebony rounded-lg shadow-md border border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-black/20">
                {isPlaying && videoId ? (
                  <div className="relative w-full h-full">
                    <YouTube
                      videoId={videoId}
                      opts={{
                        width: '100%',
                        height: '100%',
                        playerVars: {
                          autoplay: 1,
                          modestbranding: 1,
                          rel: 0
                        },
                      }}
                      onEnd={() => setActiveVideo(null)}
                      className="absolute inset-0"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center cursor-pointer group"
                    onClick={() => videoId && setActiveVideo(exercise.id)}
                  >
                    <Video className="w-12 h-12 text-gray-500 group-hover:text-sunglow transition-colors" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-powder">{exercise.name}</h3>
                  {/* {isAdmin && (
                    <div className="flex gap-2">
                      <button className="p-1 text-gray-400 hover:text-sunglow transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash size={16} />
                      </button>
                    </div>
                  )} */}
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {exercise.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Added by {exercise.createdBy.name}</span>
                  {videoId && !isPlaying && (
                    <button 
                      onClick={() => setActiveVideo(exercise.id)}
                      className="text-sunglow hover:text-sunglow/80 transition-colors"
                    >
                      Watch Video
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 
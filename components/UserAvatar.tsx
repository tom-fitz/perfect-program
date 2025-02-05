'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
}

export default function UserAvatar({ imageUrl, name }: UserAvatarProps) {
  if (!imageUrl) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <User size={20} className="text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={`${name}'s avatar`}
        fill
        className="object-cover"
      />
    </div>
  );
}

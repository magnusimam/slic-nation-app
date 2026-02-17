'use client';

import { Play, Bookmark } from 'lucide-react';
import { Video } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VideoCardProps {
  video: Video;
  onPlay?: (video: Video) => void;
  onSave?: (video: Video) => void;
}

export function VideoCard({ video, onPlay, onSave }: VideoCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
    onSave?.(video);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onPlay?.(video)}
    >
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              onPlay?.(video);
            }}
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>

        {/* Live Badge */}
        {video.isLive && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
            LIVE
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-2 sm:mt-3 space-y-1">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-foreground/70 line-clamp-1">{video.speaker}</p>
        <div className="flex items-center justify-between text-xs text-foreground/60">
          <span>{formatDate(video.date)}</span>
          <button
            onClick={handleSave}
            className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
          >
            <Bookmark
              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                isSaved ? 'fill-primary text-primary' : 'text-foreground/60'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Play, Plus, ThumbsUp, ChevronDown, Bookmark } from 'lucide-react';
import { Video } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface VideoCardProps {
  video: Video;
  onPlay?: (video: Video) => void;
  onSave?: (video: Video) => void;
  variant?: 'default' | 'compact';
}

export function VideoCard({ video, onPlay, onSave, variant = 'default' }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close expanded state when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !isExpanded) return;
    
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isExpanded]);

  const showExpanded = isMobile ? isExpanded : isHovered;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(video);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month) - 1;
    return `${months[monthIndex]} ${parseInt(day)}`;
  };

  return (
    <div
      ref={cardRef}
      className="group relative cursor-pointer"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => {
        if (isMobile) {
          if (!isExpanded) {
            setIsExpanded(true);
          }
        } else {
          onPlay?.(video);
        }
      }}
    >
      {/* Base Card */}
      <div className={`relative rounded-md overflow-hidden bg-muted transition-all duration-300 ${
        showExpanded ? 'scale-[1.02] md:scale-105 shadow-xl shadow-black/50 z-30' : 'scale-100'
      }`}>
        {/* Thumbnail */}
        <div className="relative aspect-video">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs font-medium px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>

          {/* Live Badge */}
          {video.isLive && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}

          {/* Progress Bar (if watched) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-red-600 w-0 group-hover:w-[30%] transition-all duration-1000" />
          </div>
        </div>

        {/* Expanded Content on Hover/Tap */}
        {showExpanded && (
          <div className="absolute top-full left-0 right-0 bg-card rounded-b-md p-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                className="w-9 h-9 rounded-full bg-white hover:bg-white/90 text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.(video);
                }}
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="w-9 h-9 rounded-full border-white/40 hover:border-white text-white hover:bg-white/10"
                onClick={handleSave}
              >
                <Plus className={`w-4 h-4 ${isSaved ? 'rotate-45' : ''} transition-transform`} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="w-9 h-9 rounded-full border-white/40 hover:border-white text-white hover:bg-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="w-9 h-9 rounded-full border-white/40 hover:border-white text-white hover:bg-white/10 ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobile) {
                    setIsExpanded(false);
                  }
                  onPlay?.(video);
                }}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500 font-semibold">{video.views.toLocaleString()} views</span>
              <span className="text-white/50">•</span>
              <span className="text-white/70">{formatDuration(video.duration)}</span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[10px] text-white/60">HD</span>
            </div>

            {/* Title & Speaker */}
            <div>
              <h3 className="text-sm font-semibold text-white line-clamp-1">{video.title}</h3>
              <p className="text-xs text-white/60 mt-0.5">{video.speaker}</p>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="capitalize">{video.category}</span>
              {video.series && (
                <>
                  <span>•</span>
                  <span>{video.series}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Non-hover Info */}
      {!showExpanded && (
        <div className="mt-2 space-y-1">
          <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/60">{video.speaker}</p>
            <span className="text-xs text-white/50">{formatDate(video.date)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

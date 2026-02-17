'use client';

import { useEffect, useCallback } from 'react';
import { X, Play, Plus, ThumbsUp, Share2, Volume2, VolumeX } from 'lucide-react';
import { Video } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  relatedVideos?: Video[];
}

export function VideoModal({ video, isOpen, onClose, relatedVideos = [] }: VideoModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !video) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl mx-4 my-8 lg:my-16 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="bg-card rounded-xl overflow-hidden shadow-2xl">
          {/* Video Player Section */}
          <div className="relative aspect-video bg-black">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${video.thumbnail}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            
            {/* Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="w-10 h-10 text-white fill-current ml-1" />
                </Button>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-card to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Volume Control */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-20 right-4 w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Content Details */}
          <div className="p-6 lg:p-8 space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" className="bg-white hover:bg-white/90 text-black font-bold gap-2">
                <Play className="w-5 h-5 fill-current" />
                Play
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="w-12 h-12 rounded-full border-white/30 text-white hover:border-white hover:bg-white/10"
              >
                <Plus className="w-6 h-6" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="w-12 h-12 rounded-full border-white/30 text-white hover:border-white hover:bg-white/10"
              >
                <ThumbsUp className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="w-12 h-12 rounded-full border-white/30 text-white hover:border-white hover:bg-white/10"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Video Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-500 font-semibold">{video.views.toLocaleString()} views</span>
                  <span className="text-white/70">{formatDuration(video.duration)}</span>
                  <span className="border border-white/30 px-2 py-0.5 text-xs text-white/70">HD</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl lg:text-3xl font-bold text-white">{video.title}</h2>

                {/* Description */}
                <p className="text-white/70 leading-relaxed">{video.description}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/50">Speaker: </span>
                  <span className="text-white">{video.speaker}</span>
                </div>
                {video.series && (
                  <div>
                    <span className="text-white/50">Series: </span>
                    <span className="text-white">{video.series}</span>
                  </div>
                )}
                <div>
                  <span className="text-white/50">Category: </span>
                  <span className="text-white capitalize">{video.category}</span>
                </div>
                <div>
                  <span className="text-white/50">Date: </span>
                  <span className="text-white">{new Date(video.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useCallback } from 'react';
import { X, Play, Plus, ThumbsUp, Share2, Volume2, VolumeX } from 'lucide-react';
import { Video } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Extended video type with YouTube support
interface ExtendedVideo extends Video {
  youtubeId?: string;
  videoUrl?: string;
}

interface VideoModalProps {
  video: ExtendedVideo | null;
  isOpen: boolean;
  onClose: () => void;
  relatedVideos?: Video[];
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  
  // Already a video ID (11 characters, alphanumeric with - and _)
  if (/^[\w-]{11}$/.test(input)) {
    return input;
  }
  
  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

export function VideoModal({ video, isOpen, onClose, relatedVideos = [] }: VideoModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Extract YouTube ID from youtubeId field or videoUrl
  const youtubeId = video?.youtubeId 
    ? extractYouTubeId(video.youtubeId) 
    : video?.videoUrl 
      ? extractYouTubeId(video.videoUrl) 
      : null;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsPlaying(false);
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      setIsPlaying(false); // Reset when modal closes
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Reset playing state when video changes
  useEffect(() => {
    setIsPlaying(false);
  }, [video?.id]);

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
            {/* YouTube Embed - shown when playing and have youtubeId */}
            {isPlaying && youtubeId ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                {/* Thumbnail */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('${video.thumbnail}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
            
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  {youtubeId ? (
                    <Button
                      size="lg"
                      className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
                      onClick={() => setIsPlaying(true)}
                    >
                      <Play className="w-10 h-10 text-white fill-current ml-1" />
                    </Button>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto mb-3">
                        <Play className="w-10 h-10 text-white/50 fill-current ml-1" />
                      </div>
                      <p className="text-white/60 text-sm">No video URL configured</p>
                      <p className="text-white/40 text-xs mt-1">Add a YouTube link in Content Admin</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Gradient Overlay - only show when not playing */}
            {!isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-card to-transparent" />
            )}

            {/* Close Button */}
            <button
              onClick={() => {
                setIsPlaying(false);
                onClose();
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Volume Control - only show when not playing (YouTube has its own) */}
            {!isPlaying && youtubeId && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-20 right-4 w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors z-10"
                title={isMuted ? "Video will start muted" : "Video will start with sound"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Content Details */}
          <div className="p-6 lg:p-8 space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/90 text-black font-bold gap-2"
                onClick={() => youtubeId && setIsPlaying(true)}
                disabled={!youtubeId}
              >
                <Play className="w-5 h-5 fill-current" />
                {isPlaying ? 'Playing' : 'Play'}
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

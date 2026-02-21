'use client';

import { Volume2, VolumeX, Music } from 'lucide-react';
import { useAudio } from './AudioProvider';
import { cn } from '@/lib/utils';

interface MusicToggleProps {
  variant?: 'floating' | 'inline' | 'header';
  className?: string;
}

export function MusicToggle({ variant = 'floating', className }: MusicToggleProps) {
  const { isMuted, togglePlay } = useAudio();

  if (variant === 'header') {
    return (
      <button
        onClick={togglePlay}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full transition-all',
          isMuted 
            ? 'text-foreground/60 hover:text-foreground hover:bg-muted' 
            : 'text-primary bg-primary/10 hover:bg-primary/20',
          className
        )}
        title={isMuted ? 'Play background music' : 'Pause background music'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Playing</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={togglePlay}
        className={cn(
          'w-10 h-10 lg:w-12 lg:h-12 rounded-full border flex items-center justify-center transition-colors',
          isMuted 
            ? 'border-white/40 text-white/70 hover:text-white hover:border-white' 
            : 'border-primary bg-primary/20 text-white hover:bg-primary/30',
          className
        )}
        title={isMuted ? 'Play background music' : 'Pause background music'}
      >
        {isMuted ? <VolumeX className="w-5 h-5 lg:w-6 lg:h-6" /> : <Volume2 className="w-5 h-5 lg:w-6 lg:h-6" />}
      </button>
    );
  }

  // Floating variant (default) - fixed position
  return (
    <button
      onClick={togglePlay}
      className={cn(
        'fixed bottom-20 md:bottom-6 right-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all',
        isMuted 
          ? 'bg-card border border-border text-foreground/70 hover:text-foreground hover:border-primary' 
          : 'bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse',
        className
      )}
      title={isMuted ? 'Play background music' : 'Pause background music'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Music className="w-5 h-5" />
      )}
    </button>
  );
}

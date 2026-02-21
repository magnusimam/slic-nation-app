'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Info, Plus } from 'lucide-react';
import { Video } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface HeroCarouselProps {
  items: Video[];
  onPlayVideo?: (video: Video) => void;
}

export function HeroCarousel({ items, onPlayVideo }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlay || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlay, items.length]);

  // Guard against empty items array
  if (items.length === 0) {
    return (
      <div className="relative w-full h-[56.25vw] min-h-[400px] max-h-[85vh] bg-black flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  const current = items[currentIndex];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlay(false);
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[56.25vw] min-h-[400px] max-h-[85vh] bg-black overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with Crossfade */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 scale-105"
            style={{
              backgroundImage: `url('${item.thumbnail}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          />
        </div>
      ))}

      {/* Netflix-style Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className={`absolute left-0 right-0 bottom-0 top-20 lg:top-24 flex flex-col justify-end pb-8 lg:pb-10 px-4 sm:px-8 lg:px-16 transition-all duration-700 overflow-hidden ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="max-w-2xl space-y-2 lg:space-y-3">
          {/* Series Badge */}
          {current.series && (
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-sm tracking-wider">S E R I E S</span>
              <span className="text-white/80 text-sm">{current.series}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight line-clamp-2">
            {current.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="text-green-500 font-semibold">{current.views.toLocaleString()} views</span>
            <span>{current.duration} min</span>
            <span className="border border-white/30 px-2 py-0.5 text-xs">HD</span>
          </div>

          {/* Description */}
          <p className="text-base lg:text-lg text-white/80 line-clamp-3 max-w-xl">
            {current.description}
          </p>

          {/* Speaker */}
          <p className="text-sm text-white/60">
            By <span className="text-white/90 font-medium">{current.speaker}</span>
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2">
            <Button 
              size="lg" 
              className="bg-white hover:bg-white/90 text-black font-bold gap-1.5 sm:gap-2 px-4 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
              onClick={() => onPlayVideo?.(current)}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-current" />
              Play
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white font-semibold gap-1.5 sm:gap-2 px-4 sm:px-6 lg:px-8 backdrop-blur-sm h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="hidden sm:inline">More Info</span>
              <span className="sm:hidden">Info</span>
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="hidden lg:flex w-12 h-12 rounded-full border-2 border-white/40 hover:border-white text-white hover:bg-white/10"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Netflix Style (hidden on mobile, use swipe) */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-0 top-0 bottom-0 w-12 lg:w-16 z-20 bg-black/0 hover:bg-black/30 text-white/50 hover:text-white items-center justify-center transition-all opacity-0 hover:opacity-100 group"
      >
        <ChevronLeft className="w-8 h-8 lg:w-12 lg:h-12 group-hover:scale-125 transition-transform" />
      </button>
      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-0 top-0 bottom-0 w-12 lg:w-16 z-20 bg-black/0 hover:bg-black/30 text-white/50 hover:text-white items-center justify-center transition-all opacity-0 hover:opacity-100 group"
      >
        <ChevronRight className="w-8 h-8 lg:w-12 lg:h-12 group-hover:scale-125 transition-transform" />
      </button>

      {/* Progress Indicators - Netflix Style */}
      <div className="absolute bottom-8 lg:bottom-12 right-4 lg:right-16 z-20 flex items-center gap-1">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative h-1 overflow-hidden"
          >
            <div className={`h-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 lg:w-12 bg-white' : 'w-3 lg:w-4 bg-white/40 group-hover:bg-white/60'
            }`} />
            {index === currentIndex && isAutoPlay && (
              <div 
                className="absolute top-0 left-0 h-full bg-primary animate-progress"
                style={{ animationDuration: '6s' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

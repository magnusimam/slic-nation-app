'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Video } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface HeroCarouselProps {
  items: Video[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, items.length]);

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

  return (
    <div className="relative w-full aspect-video lg:aspect-auto lg:h-screen bg-black overflow-hidden rounded-lg lg:rounded-xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: `url('${current.thumbnail}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-12">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 lg:mb-4 text-balance line-clamp-3">
            {current.title}
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-200 mb-3 lg:mb-6 line-clamp-2">
            {current.description}
          </p>
          <div className="flex items-center gap-2 sm:gap-4 mb-4 lg:mb-8 flex-wrap">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 sm:size-default">
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Play Now</span>
              <span className="sm:hidden">Play</span>
            </Button>
            <Button size="sm" variant="outline" className="hidden sm:flex border-white/30 text-white hover:bg-white/10 gap-2">
              More Info
            </Button>
            <span className="text-xs sm:text-sm text-gray-300">By {current.speaker}</span>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-8'
                : 'bg-white/30 hover:bg-white/50 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

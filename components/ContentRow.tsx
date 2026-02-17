'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Video } from '@/lib/types';
import { VideoCard } from './VideoCard';

interface ContentRowProps {
  title: string;
  items: Video[];
  onPlayVideo?: (video: Video) => void;
}

export function ContentRow({ title, items, onPlayVideo }: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div 
      className="relative group/row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title */}
      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 lg:mb-4 px-4 sm:px-6 lg:px-12 flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
        {title}
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h2>

      <div className="relative">
        {/* Left Navigation Button */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-8 w-10 md:w-12 lg:w-16 z-20 bg-gradient-to-r from-background via-background/80 to-transparent hidden md:flex items-center justify-start pl-1 md:pl-2 transition-all duration-300 ${
            canScrollLeft && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
          </div>
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-6 lg:px-12 -mx-0 touch-pan-x"
          style={{ 
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-2 md:gap-3 pb-4 md:pb-8">
            {items.map((video, index) => (
              <div 
                key={video.id} 
                className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-[calc(25%-8px)] lg:w-[calc(20%-10px)] xl:w-[calc(16.666%-10px)]"
                style={{
                  transitionDelay: `${index * 30}ms`
                }}
              >
                <VideoCard
                  video={video}
                  onPlay={onPlayVideo}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Navigation Button */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-8 w-10 md:w-12 lg:w-16 z-20 bg-gradient-to-l from-background via-background/80 to-transparent hidden md:flex items-center justify-end pr-1 md:pr-2 transition-all duration-300 ${
            canScrollRight && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
          </div>
        </button>

        {/* Edge Fade Effects */}
        <div className={`absolute left-0 top-0 bottom-4 md:bottom-8 w-8 md:w-12 lg:w-24 bg-gradient-to-r from-background to-transparent pointer-events-none transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute right-0 top-0 bottom-4 md:bottom-8 w-8 md:w-12 lg:w-24 bg-gradient-to-l from-background to-transparent pointer-events-none transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </div>
  );
}

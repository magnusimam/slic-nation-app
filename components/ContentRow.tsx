'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Video } from '@/lib/types';
import { VideoCard } from './VideoCard';
import { Button } from '@/components/ui/button';

interface ContentRowProps {
  title: string;
  items: Video[];
  onPlayVideo?: (video: Video) => void;
}

export function ContentRow({ title, items, onPlayVideo }: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 500);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl lg:text-2xl font-bold text-foreground px-4 lg:px-0">
        {title}
      </h2>

      <div className="relative group">
        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-4 pb-4 px-4 lg:px-0">
            {items.map((video) => (
              <div key={video.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4">
                <VideoCard
                  video={video}
                  onPlay={onPlayVideo}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full hidden group-hover:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full hidden group-hover:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

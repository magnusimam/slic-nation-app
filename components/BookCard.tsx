'use client';

import { Book as BookIcon, Download, Sparkles, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  onRead?: (book: Book) => void;
  onDownload?: (book: Book) => void;
}

const formatDownloads = (num: number | undefined) => {
  if (!num) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

export function BookCard({ book, onRead, onDownload }: BookCardProps) {
  const [isActive, setIsActive] = useState(false);
  const isLocalImage = book.cover.startsWith('/');
  const isPopular = (book.downloads || 0) >= 10000;

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="group">
      <div 
        className="relative rounded-xl overflow-hidden bg-muted aspect-[2/3] mb-4 shadow-lg"
        onClick={handleToggle}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        {/* Book Cover */}
        {isLocalImage ? (
          <Image
            src={book.cover}
            alt={book.title}
            fill
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Overlay - visible on hover/tap */}
        <div 
          className={`absolute inset-0 bg-black/70 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full max-w-[160px]"
            onClick={(e) => {
              e.stopPropagation();
              onRead?.(book);
            }}
          >
            <BookIcon className="w-4 h-4" />
            Read Now
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 gap-2 w-full max-w-[160px]"
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.(book);
            }}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>

        {/* Top Badges Row */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between pointer-events-none">
          {/* Left: New/Featured Badge */}
          <div className="flex flex-col gap-1.5">
            {book.isNew && (
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3 h-3" />
                NEW
              </div>
            )}
            {isPopular && !book.isNew && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <TrendingUp className="w-3 h-3" />
                POPULAR
              </div>
            )}
          </div>
          
          {/* Right: Category */}
          <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {book.category}
          </div>
        </div>

        {/* Bottom: Download Count */}
        {book.downloads && (
          <div className={`absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 transition-opacity ${isActive ? 'opacity-0' : 'opacity-100'}`}>
            <Download className="w-3 h-3" />
            {formatDownloads(book.downloads)}
          </div>
        )}

        {/* Tap hint for mobile */}
        <div className={`absolute bottom-2 right-2 md:hidden text-white/70 text-[10px] transition-opacity ${isActive ? 'opacity-0' : 'opacity-100'}`}>
          Tap for options
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-1.5 px-1">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-foreground/70">{book.author}</p>
        <div className="flex items-center justify-between text-xs text-foreground/60">
          <span>{book.pages} pages</span>
          <span>{book.year}</span>
        </div>
      </div>
    </div>
  );
}

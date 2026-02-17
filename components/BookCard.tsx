'use client';

import { Book as BookIcon, Download } from 'lucide-react';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  onRead?: (book: Book) => void;
  onDownload?: (book: Book) => void;
}

export function BookCard({ book, onRead, onDownload }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-lg overflow-hidden bg-muted h-80 mb-4">
        {/* Book Cover */}
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={() => onRead?.(book)}
            >
              <BookIcon className="w-4 h-4" />
              Read Now
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 gap-2"
              onClick={() => onDownload?.(book)}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {book.category}
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-2">
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

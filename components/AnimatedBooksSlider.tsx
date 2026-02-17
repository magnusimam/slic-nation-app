'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Book } from '@/lib/types';

interface AnimatedBooksSliderProps {
  books: Book[];
}

export function AnimatedBooksSlider({ books }: AnimatedBooksSliderProps) {
  const [index, setIndex] = useState(0);
  const [indexSlider, setIndexSlider] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    setIndexSlider((prev) => prev + 1);
    setIndex((prev) => (prev + 1) % books.length);
  };

  const handlePrev = () => {
    setIndexSlider((prev) => prev - 1);
    setIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  if (!mounted || books.length === 0) return null;

  const currentBook = books[index];
  const colors = ['#FFC406', '#16009F', '#FF0000', '#D4AF37', '#4169E1', '#FFD700'];

  return (
    <div
      className="relative w-full h-screen min-h-96 overflow-hidden transition-all duration-1000 ease-out"
      style={{ backgroundColor: colors[index % colors.length] }}
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-[3.5%] top-1/2 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2" />
      </div>

      {/* Image carousel */}
      <div className="absolute left-0 top-1/2 w-full max-w-2xl h-96 -translate-y-1/2 pointer-events-none md:left-[-72%] md:w-80 md:h-80 lg:w-96 lg:h-96">
        <div
          className="relative w-full h-full transition-transform duration-1000 ease-out"
          style={{
            transform: `rotate(${indexSlider * 60}deg)`,
          }}
        >
          {books.map((book, i) => {
            const angle = (360 / books.length) * i;
            const isActive = i === index;
            return (
              <div
                key={book.id}
                className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
                style={{
                  transform: isActive
                    ? `rotate(${angle * -1}deg) scale(0.9) translateX(-65%)`
                    : `rotate(${angle * -1}deg) scale(0.8)`,
                  transformOrigin: '200px',
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <div className="flex justify-center items-center w-64 h-96">
                  <div
                    className="relative w-48 h-80 rounded-lg overflow-hidden shadow-2xl transition-all duration-1000 ease-out"
                    style={{
                      transform: `rotate(${angle}deg) rotate(120deg)`,
                      filter: isActive ? 'blur(0px)' : 'blur(8px)',
                    }}
                  >
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info section */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-96 h-auto md:h-96 md:rounded-l-3xl px-6 md:px-16 py-12 md:py-0 md:flex md:flex-col md:justify-center">
        {books.map((book, i) => (
          <div
            key={book.id}
            className="transition-all duration-1000 ease-out absolute md:relative"
            style={{
              transform: i === index ? 'translateX(0)' : 'translateX(100%)',
              opacity: i === index ? 1 : 0,
              pointerEvents: i === index ? 'auto' : 'none',
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {book.title}
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-6">
              By {book.author}
            </h3>

            {/* Color indicators */}
            <div className="flex gap-3 mb-6">
              {books.map((_, colorIndex) => (
                <button
                  key={colorIndex}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full transition-all cursor-pointer ${
                    colorIndex === index
                      ? 'ring-2 ring-white ring-offset-2'
                      : 'ring-1 ring-white/30'
                  }`}
                  style={{
                    backgroundColor: colors[colorIndex % colors.length],
                  }}
                  onClick={() => {
                    setIndex(colorIndex);
                    setIndexSlider(colorIndex);
                  }}
                />
              ))}
            </div>

            <p className="text-sm md:text-base text-white/90 mb-6 line-clamp-4">
              {book.description}
            </p>

            <button className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-gray-800 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
              Download Now
            </button>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-[23%] md:translate-x-0 md:bottom-[7%] flex gap-4 z-50">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 backdrop-blur"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={handleNext}
          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 backdrop-blur"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Book } from '@/lib/types';

interface AnimatedBooksSliderProps {
  books: Book[];
}

export function AnimatedBooksSlider({ books }: AnimatedBooksSliderProps) {
  const [index, setIndex] = useState(0);
  const [indexSlider, setIndexSlider] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = () => {
    setIndexSlider((prev) => prev + 1);
    setIndex((prev) => (prev + 1) % books.length);
  };

  const handlePrev = () => {
    setIndexSlider((prev) => prev - 1);
    setIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  // Touch handlers for swipe support
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  if (!mounted || books.length === 0) return null;

  const colors = ['#FFC406', '#16009F', '#FF0000', '#D4AF37', '#4169E1', '#FFD700'];
  const totalItems = books.length;
  const rotationAngle = 360 / totalItems;
  const currentBook = books[index];
  const isLocalImage = currentBook.cover.startsWith('/');

  // Mobile Layout - Stacked design optimized for phones
  if (isMobile) {
    const currentBook = books[index];
    const bookIsLocal = currentBook.cover.startsWith('/');
    
    return (
      <div
        className="relative w-full min-h-[100dvh] overflow-hidden transition-all duration-700 ease-out"
        style={{ backgroundColor: colors[index % colors.length] }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background glow */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-[25%] w-[250px] h-[250px] bg-white/50 rounded-full pointer-events-none"
          style={{ filter: 'blur(80px)' }}
        />

        {/* Content Container - Single Column Centered */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] py-20 px-5">
          
          {/* Book Cover - Centered with fixed size */}
          <div className="relative w-44 h-64 mb-6 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
            {bookIsLocal ? (
              <Image
                src={currentBook.cover}
                alt={currentBook.title}
                fill
                quality={100}
                priority
                sizes="176px"
                className="object-cover"
              />
            ) : (
              <img
                src={currentBook.cover}
                alt={currentBook.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Book Info - Centered below cover */}
          <div className="w-full max-w-xs text-center text-white flex-shrink-0">
            <h2 className="text-xl font-bold leading-tight mb-1 px-2">
              {currentBook.title}
            </h2>
            <h3 className="text-base font-medium mb-4 opacity-80">
              By {currentBook.author}
            </h3>

            {/* Color Navigation Dots */}
            <div className="flex justify-center gap-2 mb-4">
              {books.map((_, colorIndex) => (
                <button
                  key={colorIndex}
                  className={`w-7 h-7 rounded-full transition-all duration-300 ${
                    colorIndex === index 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' 
                      : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor: colors[colorIndex % colors.length],
                  }}
                  onClick={() => {
                    const diff = colorIndex - index;
                    setIndexSlider((prev) => prev + diff);
                    setIndex(colorIndex);
                  }}
                />
              ))}
            </div>

            <p className="text-sm leading-relaxed mb-5 opacity-85 line-clamp-3 px-2">
              {currentBook.description}
            </p>

            <button className="inline-flex justify-center items-center w-44 h-11 bg-white rounded-full shadow-lg text-sm text-gray-800 font-semibold active:scale-95 transition-transform">
              Download Now
            </button>
          </div>

          {/* Navigation Buttons - Below content */}
          <div className="flex justify-center gap-6 mt-6 flex-shrink-0">
            <button
              onClick={handlePrev}
              className="flex justify-center items-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="flex justify-center items-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white active:scale-95 transition-transform"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Swipe hint */}
          <p className="text-white/50 text-xs mt-4">Swipe left or right</p>
        </div>
      </div>
    );
  }

  // Desktop/Tablet Layout - Rotating carousel
  return (
    <div
      className="relative w-full h-screen min-h-[600px] overflow-hidden transition-all duration-1000 ease-out"
      style={{ backgroundColor: colors[index % colors.length] }}
    >
      {/* Background blur effect - large white glow */}
      <div 
        className="absolute left-[3.5%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[700px] lg:h-[700px] bg-white/80 rounded-full pointer-events-none"
        style={{ filter: 'blur(200px)' }}
      />

      {/* Rotating Image Carousel Container */}
      <div 
        className="absolute top-1/2 -translate-y-1/2"
        style={{ 
          left: '-72%',
          width: '1300px',
          height: '1300px',
        }}
      >
        {/* Base rotation container - tilted to show active at right edge */}
        <div 
          className="w-full h-full"
          style={{ transform: 'rotate(-120deg)' }}
        >
          {/* Animated slider - rotates on navigation */}
          <div 
            className="w-full h-full transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${indexSlider * rotationAngle}deg)` }}
          >
            {books.map((book, i) => {
              const isActive = i === index;
              const itemRotation = -rotationAngle * (i + 1);
              const bookIsLocal = book.cover.startsWith('/');
              
              return (
                <div
                  key={book.id}
                  className="absolute left-0 top-1/2 transition-all duration-1000 ease-out"
                  style={{
                    transform: isActive
                      ? `translateY(-50%) rotate(${itemRotation}deg) scale(0.9) translateX(-65%)`
                      : `translateY(-50%) rotate(${itemRotation}deg) scale(0.8)`,
                    transformOrigin: '650px',
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  <div className="flex justify-center items-center transition-all duration-1000 ease-out">
                    <div 
                      className="relative w-56 h-80 lg:w-72 lg:h-[420px] rounded-xl overflow-hidden shadow-2xl transition-all duration-1000 ease-out"
                      style={{
                        transform: `rotate(${-itemRotation}deg) rotate(120deg)`,
                        filter: isActive ? 'blur(0)' : 'blur(8px)',
                      }}
                    >
                      {bookIsLocal ? (
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          quality={100}
                          priority={isActive}
                          sizes="(max-width: 1024px) 224px, 288px"
                          className="object-cover"
                        />
                      ) : (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Box - Right Side Panel */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] lg:w-[500px] h-[450px] lg:h-[500px]">
        {books.map((book, i) => {
          const isActive = i === index;
          return (
            <div
              key={book.id}
              className="absolute w-full h-full rounded-l-[40px] px-12 lg:px-16 text-white flex flex-col justify-center transition-all duration-1000 ease-out"
              style={{
                transform: isActive ? 'translateX(0)' : 'translateX(100%)',
                opacity: isActive ? 1 : 0,
                boxShadow: isActive ? '0 0 30px rgba(0,0,0,0.2)' : 'none',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <h2 className="text-[28px] lg:text-[30px] font-bold leading-tight">
                {book.title}
              </h2>
              <h3 className="text-2xl font-semibold mt-4 mb-5">
                By {book.author}
              </h3>

              {/* Color Navigation Dots */}
              <div className="flex gap-2.5 mb-5">
                {books.map((_, colorIndex) => (
                  <button
                    key={colorIndex}
                    className={`w-[30px] h-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                      colorIndex === index ? 'outline outline-[3px] outline-white outline-offset-2' : ''
                    }`}
                    style={{
                      backgroundColor: colors[colorIndex % colors.length],
                    }}
                    onClick={() => {
                      const diff = colorIndex - index;
                      setIndexSlider((prev) => prev + diff);
                      setIndex(colorIndex);
                    }}
                  />
                ))}
              </div>

              <p className="text-base leading-relaxed mb-6 line-clamp-4 opacity-90">
                {book.description}
              </p>

              <button className="inline-flex justify-center items-center w-[180px] h-[47px] bg-white rounded-full shadow-lg text-base text-gray-800 font-semibold hover:bg-gray-100 transition-colors">
                Download Now
              </button>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute left-[23%] bottom-[7%] w-[150px] flex justify-between z-50">
        <button
          onClick={handlePrev}
          className="inline-flex justify-center items-center w-[50px] h-[50px] bg-white/20 rounded-full cursor-pointer text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button
          onClick={handleNext}
          className="inline-flex justify-center items-center w-[50px] h-[50px] bg-white/20 rounded-full cursor-pointer text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}

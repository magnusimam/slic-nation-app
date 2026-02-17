'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ContentRow } from '@/components/ContentRow';
import { VideoModal } from '@/components/VideoModal';
import { FEATURED_VIDEOS, CONTENT_ROWS, LIVE_SERVICES } from '@/lib/mockData';
import { Video } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header transparent />

      <main className="w-full">
        {/* Hero Carousel - Full Width */}
        <HeroCarousel items={FEATURED_VIDEOS} onPlayVideo={handlePlayVideo} />

        {/* Content Rows */}
        <div className="relative z-10 space-y-4 md:space-y-6 lg:space-y-10 pb-20 md:pb-8 lg:pb-12 pt-4 md:pt-6 lg:pt-8">
          {/* Live Service Banner */}
          <div className="px-4 sm:px-6 lg:px-12">
            <div className="bg-gradient-to-r from-red-600/30 via-red-600/20 to-transparent border border-red-500/30 rounded-xl p-4 md:p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg bg-red-600 flex items-center justify-center">
                    <Play className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white fill-current" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                    <Badge className="bg-red-600 hover:bg-red-600 text-[10px] md:text-xs">LIVE NOW</Badge>
                  </div>
                  <h2 className="text-base md:text-lg lg:text-xl font-bold text-white">Sunday Morning Service</h2>
                  <p className="text-white/60 text-xs md:text-sm hidden sm:block">Join thousands watching now</p>
                </div>
              </div>
              <Link href="/live" className="w-full sm:w-auto">
                <Button size="default" className="bg-white hover:bg-white/90 text-black font-bold gap-2 whitespace-nowrap w-full sm:w-auto h-10 md:h-11">
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  Watch Live
                </Button>
              </Link>
            </div>
          </div>

          {/* Content Rows */}
          {CONTENT_ROWS.map((row, index) => (
            <ContentRow
              key={index}
              title={row.title}
              items={row.items}
              onPlayVideo={handlePlayVideo}
            />
          ))}

          {/* Call to Action Section */}
          <div className="px-4 sm:px-6 lg:px-12 pt-6 md:pt-8">
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 backdrop-blur-sm">
              <div className="max-w-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">Support Our Ministry</h2>
                <p className="text-sm md:text-base lg:text-lg text-white/70 mb-5 md:mb-8">
                  Your generous giving helps us reach more people with the Gospel. Partner with us in spreading God&apos;s Word around the world.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 md:gap-4">
                  <Link href="/donate" className="w-full sm:w-auto">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 w-full sm:w-auto">
                      Give Now
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </Link>
                  <Link href="/books" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold gap-2 w-full sm:w-auto">
                      Explore Books
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Video Modal */}
      <VideoModal 
        video={selectedVideo} 
        isOpen={!!selectedVideo} 
        onClose={handleCloseModal}
      />
    </div>
  );
}

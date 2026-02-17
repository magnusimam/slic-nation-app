'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ContentRow } from '@/components/ContentRow';
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full">
        {/* Hero Carousel */}
        <div className="px-4 lg:px-8 py-4 lg:py-6">
          <HeroCarousel items={FEATURED_VIDEOS} />
        </div>

        {/* Live Service Banner */}
        <div className="px-4 lg:px-8 mb-8 lg:mb-12">
          <div className="bg-gradient-to-r from-blue-600/20 to-secondary/20 border border-secondary/30 rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <Badge className="bg-red-600 hover:bg-red-600">LIVE NOW</Badge>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Sunday Morning Service</h2>
              <p className="text-foreground/70">Join us for live worship and teaching. Experience the presence of God with our community.</p>
            </div>
            <Link href="/live">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 whitespace-nowrap">
                <Play className="w-5 h-5" />
                Watch Live
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Rows */}
        <div className="space-y-8 lg:space-y-12 px-4 lg:px-8 pb-8 lg:pb-12">
          {CONTENT_ROWS.map((row, index) => (
            <ContentRow
              key={index}
              title={row.title}
              items={row.items}
              onPlayVideo={handlePlayVideo}
            />
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="px-4 lg:px-8 mb-8 lg:mb-12">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-8 lg:p-12 text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Support Our Ministry</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Your generous giving helps us reach more people with the Gospel. Partner with us in spreading God&apos;s Word around the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/donate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  Give Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/books">
                <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 gap-2">
                  Explore Books
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VideoCard } from '@/components/VideoCard';
import { CATEGORIES, SERMON_VIDEOS } from '@/lib/mockData';
import { Video } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // Find the category
  const category = CATEGORIES.find((cat) => cat.id === categoryId);

  // Filter videos by category
  const categoryVideos = SERMON_VIDEOS.filter(
    (video) => video.category.toLowerCase() === categoryId.toLowerCase()
  );

  const handleSaveItem = (video: Video) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(video.id)) {
      newSaved.delete(video.id);
    } else {
      newSaved.add(video.id);
    }
    setSavedItems(newSaved);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 lg:pt-28 pb-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category not found</h1>
          <Link href="/categories">
            <Button>Back to Categories</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Category Background */}
      <div className={`bg-gradient-to-r ${category.color} relative overflow-hidden pt-16 sm:pt-20`}>
        <img
          src={category.thumbnail}
          alt={category.name}
          className="w-full h-64 sm:h-80 object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Link href="/categories" className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 text-balance">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* Videos Section */}
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              All {category.name} Videos
            </h2>
            <span className="text-sm text-foreground/70 bg-muted px-3 py-1 rounded-full">
              {categoryVideos.length} videos
            </span>
          </div>

          {/* Video Grid */}
          {categoryVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {categoryVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={() => console.log('Play', video.title)}
                  onSave={handleSaveItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-foreground/70 text-lg mb-6">
                No videos found in this category yet.
              </p>
              <p className="text-foreground/50 mb-6">
                Check back soon for more content!
              </p>
              <Link href="/categories">
                <Button variant="outline">Browse Other Categories</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Related Categories */}
        <div className="mt-16 pt-12 border-t border-border">
          <h3 className="text-2xl font-bold text-foreground mb-8">More to Explore</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORIES.filter((cat) => cat.id !== categoryId)
              .slice(0, 4)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="group relative overflow-hidden rounded-lg h-32 sm:h-40 cursor-pointer"
                >
                  <img
                    src={cat.thumbnail}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-50 group-hover:opacity-60 transition-opacity`}
                  />
                  <div className="absolute inset-0 flex items-end p-3 sm:p-4">
                    <span className="text-sm sm:text-base font-semibold text-white group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

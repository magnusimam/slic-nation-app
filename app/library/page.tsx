'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VideoCard } from '@/components/VideoCard';
import { SERMON_VIDEOS, CATEGORIES, SPEAKERS } from '@/lib/mockData';
import { Video } from '@/lib/types';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSpeaker, setSelectedSpeaker] = useState('All Speakers');
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const filteredVideos = useMemo(() => {
    return SERMON_VIDEOS.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.speaker.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        video.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSpeaker =
        selectedSpeaker === 'All Speakers' ||
        video.speaker === selectedSpeaker;

      return matchesSearch && matchesCategory && matchesSpeaker;
    });
  }, [searchTerm, selectedCategory, selectedSpeaker]);

  const handleSaveItem = (video: Video) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(video.id)) {
      newSaved.delete(video.id);
    } else {
      newSaved.add(video.id);
    }
    setSavedItems(newSaved);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="space-y-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Video Library</h1>
            <p className="text-foreground/70">
              Explore our collection of sermons, teachings, and spiritual messages.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <Input
              type="text"
              placeholder="Search sermons, speakers, or keywords..."
              className="pl-10 py-6 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-4 md:hidden"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 ${!showFilters && 'hidden md:grid'}`}>
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speaker Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Speaker</label>
              <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPEAKERS.map((speaker) => (
                    <SelectItem key={speaker} value={speaker}>
                      {speaker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'All' || selectedSpeaker !== 'All Speakers') && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-foreground/70">Active filters:</span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 text-sm rounded-full transition-colors flex items-center gap-2"
                >
                  {selectedCategory}
                  <span className="text-foreground/50">×</span>
                </button>
              )}
              {selectedSpeaker !== 'All Speakers' && (
                <button
                  onClick={() => setSelectedSpeaker('All Speakers')}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 text-sm rounded-full transition-colors flex items-center gap-2"
                >
                  {selectedSpeaker}
                  <span className="text-foreground/50">×</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-sm text-foreground/70 mb-6">
          {filteredVideos.length} result{filteredVideos.length !== 1 ? 's' : ''} found
        </p>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
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
            <p className="text-foreground/70 text-lg mb-4">No videos found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedSpeaker('All Speakers');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

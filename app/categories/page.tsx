'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CONTINUE_WATCHING } from '@/lib/mockData';
import { getCategories as getSupabaseCategories } from '@/lib/supabase/categories';
import { Category, ContinueWatchingItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Play,
  ChevronRight,
  Flame,
  Sparkles,
  Clock,
  ArrowUpDown,
  Grid3X3,
  LayoutList,
  ChevronLeft,
  History,
  TrendingUp,
  Timer,
  Plus,
  X,
} from 'lucide-react';

type SortOption = 'name' | 'videos' | 'recent' | 'trending';

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from Supabase
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getSupabaseCategories();
        setCategories(data);
      } catch {
        const { CATEGORIES } = await import('@/lib/mockData');
        setCategories(CATEGORIES);
      }
    }
    loadCategories();
  }, []);

  // Featured categories (trending or new)
  const featuredCategories = useMemo(() => 
    categories.filter(cat => cat.isTrending || cat.isNew),
    [categories]
  );

  // Auto-rotate featured category
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredCategories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredCategories.length]);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let result = [...categories];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'videos':
        result.sort((a, b) => b.videoCount - a.videoCount);
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime());
        break;
      case 'trending':
        result.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.videoCount - a.videoCount;
        });
        break;
    }
    
    return result;
  }, [categories, searchQuery, sortBy]);

  const currentFeatured = featuredCategories[featuredIndex];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 sm:pt-20 pb-8 lg:pb-12">
        {/* Featured Category Hero */}
        {currentFeatured && (
          <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={currentFeatured.thumbnail}
                alt={currentFeatured.name}
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${currentFeatured.color} opacity-70`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col justify-end pb-8 lg:pb-12">
              <div className="flex items-center gap-2 mb-3">
                {currentFeatured.isTrending && (
                  <Badge className="bg-orange-500/90 hover:bg-orange-500 text-white gap-1">
                    <Flame className="w-3 h-3" /> Trending
                  </Badge>
                )}
                {currentFeatured.isNew && (
                  <Badge className="bg-green-500/90 hover:bg-green-500 text-white gap-1">
                    <Sparkles className="w-3 h-3" /> New
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {currentFeatured.videoCount} videos
                </Badge>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {currentFeatured.name}
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mb-4 line-clamp-2">
                {currentFeatured.description}
              </p>
              
              <div className="flex items-center gap-3">
                <Link href={`/categories/${currentFeatured.id}`}>
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <Play className="w-4 h-4 fill-current" />
                    Browse Category
                  </Button>
                </Link>
              </div>

              {/* Hero Indicators */}
              <div className="absolute bottom-4 right-4 lg:right-8 flex items-center gap-2">
                <button
                  onClick={() => setFeaturedIndex((prev) => (prev - 1 + featuredCategories.length) % featuredCategories.length)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <div className="flex gap-1.5">
                  {featuredCategories.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFeaturedIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === featuredIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setFeaturedIndex((prev) => (prev + 1) % featuredCategories.length)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Continue Where You Left Off Section */}
        {CONTINUE_WATCHING.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Continue Watching
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
                See All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {CONTINUE_WATCHING.map((item) => (
                <ContinueWatchingCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Categories Banner */}
        {(() => {
          const trendingCategories = categories.filter(c => c.isTrending);
          if (trendingCategories.length === 0) return null;
          return (
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 border border-orange-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent" />
                <div className="relative p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-full bg-orange-500/20">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Trending Now</h3>
                    <Badge className="bg-orange-500/90 text-white text-[10px]">
                      <Flame className="w-3 h-3 mr-0.5" /> Hot
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {trendingCategories.map((cat) => (
                      <Link key={cat.id} href={`/categories/${cat.id}`}>
                        <div className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 hover:bg-background/80 border border-border/50 hover:border-primary/50 transition-all">
                          <div className="w-8 h-8 rounded-md overflow-hidden">
                            <img src={cat.thumbnail} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {cat.name}
                            </p>
                            <p className="text-xs text-foreground/60">{cat.videoCount} videos</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-border"
              />
            </div>

            {/* Sort & View Options */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setSortBy('trending')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    sortBy === 'trending' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 inline mr-1" />
                  Trending
                </button>
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    sortBy === 'name' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  A-Z
                </button>
                <button
                  onClick={() => setSortBy('videos')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    sortBy === 'videos' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Most Videos
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors hidden sm:block ${
                    sortBy === 'recent' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Recent
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-foreground/60 mb-4 animate-fade-in">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} found
          </p>

          {/* Grouped Category Sections (when no search) */}
          {!searchQuery && sortBy === 'trending' && viewMode === 'grid' ? (
            <div className="space-y-12">
              {/* Most Popular Section */}
              <CategorySection
                title="Most Popular"
                icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
                categories={categories.filter(c => c.isTrending)}
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
                formatDate={formatDate}
                badgeColor="bg-orange-500/20 text-orange-400"
                badgeText="Trending"
              />

              {/* New Arrivals Section */}
              <CategorySection
                title="New Arrivals"
                icon={<Sparkles className="w-5 h-5 text-green-500" />}
                categories={categories.filter(c => c.isNew)}
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
                formatDate={formatDate}
                badgeColor="bg-green-500/20 text-green-400"
                badgeText="Just Added"
              />

              {/* Browse All Section */}
              <CategorySection
                title="Browse All Categories"
                icon={<Grid3X3 className="w-5 h-5 text-primary" />}
                categories={categories}
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
                formatDate={formatDate}
                showAll
              />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <EnhancedCategoryCard
                    category={category}
                    isHovered={hoveredCategory === category.id}
                    onHover={() => setHoveredCategory(category.id)}
                    onLeave={() => setHoveredCategory(null)}
                    formatDate={formatDate}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <CategoryListItem
                    category={category}
                    formatDate={formatDate}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-foreground/30" />
              </div>
              <p className="text-foreground/70 text-lg mb-2">No categories found</p>
              <p className="text-foreground/50 text-sm mb-4">Try adjusting your search</p>
              <Button variant="outline" onClick={() => setSearchQuery('')} className="hover:scale-105 transition-transform">
                Clear Search
              </Button>
            </div>
          )}

          {/* Stats Section with animations */}
          <div className="mt-16 pt-12 border-t border-border">
            <h3 className="text-center text-foreground/50 text-sm uppercase tracking-widest mb-8 animate-fade-in">
              Platform Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="text-center opacity-0 animate-fade-in-up stagger-1 group hover:scale-105 transition-transform cursor-default">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                  <Grid3X3 className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {categories.length}
                </p>
                <p className="text-sm text-foreground/70">Categories</p>
              </div>
              <div className="text-center opacity-0 animate-fade-in-up stagger-2 group hover:scale-105 transition-transform cursor-default">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-3 group-hover:bg-blue-500/20 transition-colors">
                  <Play className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-blue-500 mb-1">
                  {categories.reduce((sum, cat) => sum + cat.videoCount, 0)}
                </p>
                <p className="text-sm text-foreground/70">Total Videos</p>
              </div>
              <div className="text-center opacity-0 animate-fade-in-up stagger-3 group hover:scale-105 transition-transform cursor-default">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3 group-hover:bg-green-500/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-green-500 mb-1">
                  1M+
                </p>
                <p className="text-sm text-foreground/70">Total Views</p>
              </div>
              <div className="text-center opacity-0 animate-fade-in-up stagger-4 group hover:scale-105 transition-transform cursor-default">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-3 group-hover:bg-purple-500/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-purple-500 mb-1">
                  Growing
                </p>
                <p className="text-sm text-foreground/70">Daily Content</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Enhanced Category Card with hover preview
function EnhancedCategoryCard({
  category,
  isHovered,
  onHover,
  onLeave,
  formatDate,
}: {
  category: Category;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  formatDate: (date?: string) => string;
}) {
  return (
    <Link href={`/categories/${category.id}`}>
      <div
        className="group relative overflow-hidden rounded-xl h-52 sm:h-56 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {/* Background Image */}
        <img
          src={category.thumbnail}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-75 transition-opacity duration-300`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badges with pulse animation on trending */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          {category.isNew && (
            <Badge className="bg-green-500/90 hover:bg-green-500 text-white text-[10px] gap-1 shadow-lg shadow-green-500/30">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" /> NEW
            </Badge>
          )}
          {category.isTrending && (
            <Badge className="bg-orange-500/90 hover:bg-orange-500 text-white text-[10px] gap-1 shadow-lg shadow-orange-500/30">
              <Flame className="w-2.5 h-2.5 animate-pulse" /> HOT
            </Badge>
          )}
          {category.recentlyAddedCount && category.recentlyAddedCount > 0 && (
            <Badge className="bg-blue-500/90 hover:bg-blue-500 text-white text-[10px] gap-1 shadow-lg shadow-blue-500/30">
              <Plus className="w-2.5 h-2.5" /> {category.recentlyAddedCount} New
            </Badge>
          )}
        </div>

        {/* Play Preview Icon with scale animation */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          <div className="bg-primary/90 rounded-full p-2 shadow-lg shadow-primary/40">
            <Play className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Content with slide-up effect on hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300 transform group-hover:-translate-y-0.5">
            {category.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-200 mb-3 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-gray-300 flex items-center gap-1">
                <Play className="w-3 h-3" /> {category.videoCount} videos
              </span>
              {category.totalDuration && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-xs text-gray-300 flex items-center gap-1">
                    <Timer className="w-3 h-3" /> {category.totalDuration}h
                  </span>
                </>
              )}
              {category.lastUpdated && (
                <>
                  <span className="text-gray-500 hidden sm:inline">•</span>
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    Updated {formatDate(category.lastUpdated)}
                  </span>
                </>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Preview Thumbnails on Hover */}
        {isHovered && category.previewVideos && category.previewVideos.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-3 transform transition-transform animate-slide-up">
            <p className="text-[10px] text-white/60 mb-2 uppercase tracking-wider">Preview</p>
            <div className="flex gap-2">
              {category.previewVideos.slice(0, 3).map((thumb, idx) => (
                <div key={idx} className="flex-1 relative rounded overflow-hidden aspect-video">
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hover effect border */}
        <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      </div>
    </Link>
  );
}

// List view item
function CategoryListItem({
  category,
  formatDate,
}: {
  category: Category;
  formatDate: (date?: string) => string;
}) {
  return (
    <Link href={`/categories/${category.id}`}>
      <div className="group flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
        {/* Thumbnail */}
        <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden shrink-0">
          <img
            src={category.thumbnail}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-40`} />
          {/* Size indicator overlay */}
          {category.totalDuration && (
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white flex items-center gap-0.5">
              <Timer className="w-2.5 h-2.5" /> {category.totalDuration}h
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {category.name}
            </h3>
            {category.isNew && (
              <Badge className="bg-green-500/90 text-white text-[10px] h-5 gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> NEW
              </Badge>
            )}
            {category.isTrending && (
              <Badge className="bg-orange-500/90 text-white text-[10px] h-5 gap-0.5">
                <Flame className="w-2.5 h-2.5" /> HOT
              </Badge>
            )}
            {category.recentlyAddedCount && category.recentlyAddedCount > 0 && (
              <Badge className="bg-blue-500/90 text-white text-[10px] h-5 gap-0.5">
                <Plus className="w-2.5 h-2.5" /> {category.recentlyAddedCount} New
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground/70 line-clamp-1 mb-1">{category.description}</p>
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <span className="flex items-center gap-1">
              <Play className="w-3 h-3" /> {category.videoCount} videos
            </span>
            {category.totalDuration && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3" /> {category.totalDuration} hours
                </span>
              </>
            )}
            {category.lastUpdated && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Updated {formatDate(category.lastUpdated)}</span>
              </>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </Link>
  );
}

// Continue Watching Card component
function ContinueWatchingCard({ item }: { item: ContinueWatchingItem }) {
  const remainingMinutes = Math.round(item.duration * (1 - item.progress / 100));
  
  return (
    <div className="group relative rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <Progress value={item.progress} className="h-1 rounded-none bg-white/20" />
        </div>

        {/* Duration remaining */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
          {remainingMinutes} min left
        </div>

        {/* Remove button */}
        <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80">
          <X className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <Link href={`/categories/${item.categoryId}`}>
            <Badge variant="secondary" className="text-[10px] hover:bg-primary/20 transition-colors">
              {item.categoryName}
            </Badge>
          </Link>
          <span className="text-xs text-foreground/50">{item.progress}% complete</span>
        </div>
      </div>
    </div>
  );
}

// Category Section with animated header and staggered cards
function CategorySection({
  title,
  icon,
  categories,
  hoveredCategory,
  setHoveredCategory,
  formatDate,
  badgeColor,
  badgeText,
  showAll = false,
}: {
  title: string;
  icon: React.ReactNode;
  categories: Category[];
  hoveredCategory: string | null;
  setHoveredCategory: (id: string | null) => void;
  formatDate: (date?: string) => string;
  badgeColor?: string;
  badgeText?: string;
  showAll?: boolean;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header with animation */}
      <div className="flex items-center justify-between animate-slide-in-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            {icon}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
            {badgeText && (
              <Badge className={`${badgeColor} text-[10px] mt-1`}>
                {badgeText}
              </Badge>
            )}
          </div>
        </div>
        {!showAll && categories.length > 3 && (
          <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-primary group">
            View All
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>

      {/* Cards Grid with staggered animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {(showAll ? categories : categories.slice(0, 3)).map((category, index) => (
          <div
            key={category.id}
            className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
          >
            <EnhancedCategoryCard
              category={category}
              isHovered={hoveredCategory === category.id}
              onHover={() => setHoveredCategory(category.id)}
              onLeave={() => setHoveredCategory(null)}
              formatDate={formatDate}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

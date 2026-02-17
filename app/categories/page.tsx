'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CategoryCard } from '@/components/CategoryCard';
import { CATEGORIES } from '@/lib/mockData';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Browse by Category
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl">
            Explore our library of sermons, teachings, and spiritual content organized by category. Find what resonates with your spiritual journey.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {CATEGORIES.length}
              </p>
              <p className="text-sm text-foreground/70">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {CATEGORIES.reduce((sum, cat) => sum + cat.videoCount, 0)}
              </p>
              <p className="text-sm text-foreground/70">Total Videos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
                1M+
              </p>
              <p className="text-sm text-foreground/70">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Growing
              </p>
              <p className="text-sm text-foreground/70">Daily Content</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

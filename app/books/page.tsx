'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnimatedBooksSlider } from '@/components/AnimatedBooksSlider';
import { BookCard } from '@/components/BookCard';
import { BOOKS } from '@/lib/mockData';
import { Book } from '@/lib/types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BOOK_CATEGORIES = ['All', 'Christian Living', 'Spirituality', 'Devotional', 'Prayer'];

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = BOOKS.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort books
    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      filtered.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'year') {
      filtered.sort((a, b) => b.year - a.year);
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const handleReadBook = (book: Book) => {
    console.log('Reading book:', book.title);
  };

  const handleDownloadBook = (book: Book) => {
    console.log('Downloading book:', book.title);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Animated Books Slider */}
      <AnimatedBooksSlider books={BOOKS.slice(0, 6)} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Page Header */}
        <div className="space-y-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Browse All Books</h1>
            <p className="text-foreground/70">
              Explore our complete collection of ministry resources and spiritual teachings.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <Input
              type="text"
              placeholder="Search books or authors..."
              className="pl-10 py-6 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOOK_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="author">Author (A-Z)</SelectItem>
                <SelectItem value="year">Year (Newest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-foreground/70 mb-8">
          {filteredAndSortedBooks.length} book{filteredAndSortedBooks.length !== 1 ? 's' : ''} available
        </p>

        {/* Books Grid */}
        {filteredAndSortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRead={handleReadBook}
                onDownload={handleDownloadBook}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-foreground/70 text-lg">No books found matching your search.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

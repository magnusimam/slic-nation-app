'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnimatedBooksSlider } from '@/components/AnimatedBooksSlider';
import { BookCard } from '@/components/BookCard';
import { BOOKS } from '@/lib/mockData';
import { Book } from '@/lib/types';
import { Search, BookOpen, Download, Mail, Sparkles, TrendingUp, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const BOOK_CATEGORIES = ['All', 'Christian Living', 'Spirituality', 'Devotional', 'Prayer'];

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Curated collections
  const featuredBooks = useMemo(() => BOOKS.filter(book => book.isFeatured), []);
  const mostDownloaded = useMemo(() => 
    [...BOOKS].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 4), 
  []);

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleReadBook = (book: Book) => {
    console.log('Reading book:', book.title);
  };

  const handleDownloadBook = (book: Book) => {
    console.log('Downloading book:', book.title);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      console.log('Subscribed:', email);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  // Author data
  const authorInfo = {
    name: 'Apst Emmanuel Etim',
    title: 'Founder, SLIC Nations',
    quote: '"Every book is a seed of revelation planted in the hearts of believers to produce a harvest of transformation."',
    booksCount: BOOKS.filter(b => b.author === 'Apst Emmanuel Etim').length,
    totalDownloads: BOOKS.filter(b => b.author === 'Apst Emmanuel Etim')
      .reduce((sum, b) => sum + (b.downloads || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header transparent />

      {/* Animated Books Slider */}
      <AnimatedBooksSlider books={BOOKS.slice(0, 6)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 md:space-y-16">
        
        {/* Author Spotlight Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              {/* Author Image Placeholder */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 ring-4 ring-primary/20">
                <span className="text-3xl md:text-4xl font-bold text-primary-foreground">AE</span>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-3">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">{authorInfo.name}</h3>
                  <p className="text-sm text-foreground/60">{authorInfo.title}</p>
                </div>
                
                <blockquote className="text-base md:text-lg text-foreground/80 italic leading-relaxed">
                  {authorInfo.quote}
                </blockquote>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-foreground/70">{authorInfo.booksCount} Books</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Download className="w-4 h-4 text-primary" />
                    <span className="text-foreground/70">{authorInfo.totalDownloads.toLocaleString()} Downloads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Books Section */}
        {featuredBooks.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Featured Books
                </h2>
                <p className="text-sm text-foreground/60">Handpicked spiritual resources</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onRead={handleReadBook}
                  onDownload={handleDownloadBook}
                />
              ))}
            </div>
          </section>
        )}

        {/* Most Downloaded Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-green-500 rounded-full" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Most Downloaded
              </h2>
              <p className="text-sm text-foreground/60">Popular with our community</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {mostDownloaded.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRead={handleReadBook}
                onDownload={handleDownloadBook}
              />
            ))}
          </div>
        </section>

        {/* Browse All Section */}
        <section>
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-foreground/30 rounded-full" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Browse All Books</h2>
                <p className="text-sm text-foreground/60">Explore our complete collection</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
              <Input
                type="text"
                placeholder="Search books or authors..."
                className="pl-12 pr-10 py-6 text-base rounded-full border-foreground/20 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {BOOK_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'bg-muted text-foreground/70 hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-sm text-foreground/60">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>

            {/* Books Grid or Empty State */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onRead={handleReadBook}
                    onDownload={handleDownloadBook}
                  />
                ))}
              </div>
            ) : (
              /* Enhanced Empty State */
              <div className="text-center py-16 px-4">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-foreground/30" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No books found</h3>
                <p className="text-foreground/60 mb-6 max-w-md mx-auto">
                  We couldn't find any books matching your search. Try adjusting your filters or search term.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={clearSearch} variant="default" className="gap-2">
                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Request a Book
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/10">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative p-6 md:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Get Notified of New Releases
            </h3>
            <p className="text-foreground/70 mb-6 max-w-lg mx-auto">
              Be the first to know when new books are published. Join our mailing list for exclusive updates and spiritual resources.
            </p>
            
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-500 font-medium">
                <Sparkles className="w-5 h-5" />
                Thank you for subscribing! You'll hear from us soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 py-6 text-base rounded-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" size="lg" className="rounded-full px-8 gap-2">
                  Subscribe
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

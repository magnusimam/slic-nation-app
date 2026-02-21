import { Video, Book } from './types';
import { SERMON_VIDEOS, BOOKS } from './mockData';

const VIDEOS_STORAGE_KEY = 'slic-nations-videos';
const BOOKS_STORAGE_KEY = 'slic-nations-books';
const INITIALIZED_KEY = 'slic-nations-content-initialized';

/**
 * Content Manager
 * 
 * Manages videos and books content via localStorage.
 * Admin can add/edit/delete content, frontend reads from here.
 * Initializes with mock data on first load.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION - Seed with mock data on first use
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeContentIfNeeded(): void {
  if (typeof window === 'undefined') return;
  
  const initialized = localStorage.getItem(INITIALIZED_KEY);
  if (initialized) return;
  
  // Convert mock videos to managed videos
  const now = new Date().toISOString();
  const initialVideos: ManagedVideo[] = SERMON_VIDEOS.map((v, index) => ({
    ...v,
    isFeatured: index < 3, // First 3 are featured
    createdAt: now,
    updatedAt: now,
  }));
  
  // Convert mock books to managed books  
  const initialBooks: ManagedBook[] = BOOKS.map(b => ({
    ...b,
    createdAt: now,
    updatedAt: now,
  }));
  
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(initialVideos));
  localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(initialBooks));
  localStorage.setItem(INITIALIZED_KEY, 'true');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIDEO MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ManagedVideo extends Video {
  /** YouTube video ID (if hosted on YouTube) */
  youtubeId?: string;
  /** External video URL (if not YouTube) */
  videoUrl?: string;
  /** Whether this video is featured on homepage */
  isFeatured?: boolean;
  /** Sort order for display */
  sortOrder?: number;
  /** Created timestamp */
  createdAt: string;
  /** Updated timestamp */
  updatedAt: string;
}

/**
 * Get all videos from localStorage
 */
export function getVideos(): ManagedVideo[] {
  if (typeof window === 'undefined') return [];
  initializeContentIfNeeded();
  try {
    const data = localStorage.getItem(VIDEOS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ManagedVideo[];
  } catch {
    return [];
  }
}

/**
 * Save videos to localStorage
 */
export function saveVideos(videos: ManagedVideo[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
}

/**
 * Add a new video
 */
export function addVideo(video: Omit<ManagedVideo, 'id' | 'createdAt' | 'updatedAt'>): ManagedVideo {
  const videos = getVideos();
  const now = new Date().toISOString();
  const newVideo: ManagedVideo = {
    ...video,
    id: `vid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };
  videos.push(newVideo);
  saveVideos(videos);
  return newVideo;
}

/**
 * Update a video
 */
export function updateVideo(id: string, updates: Partial<ManagedVideo>): ManagedVideo | null {
  const videos = getVideos();
  const index = videos.findIndex(v => v.id === id);
  if (index === -1) return null;
  videos[index] = { 
    ...videos[index], 
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveVideos(videos);
  return videos[index];
}

/**
 * Delete a video
 */
export function deleteVideo(id: string): boolean {
  const videos = getVideos();
  const filtered = videos.filter(v => v.id !== id);
  if (filtered.length === videos.length) return false;
  saveVideos(filtered);
  return true;
}

/**
 * Get featured videos
 */
export function getFeaturedVideos(): ManagedVideo[] {
  return getVideos().filter(v => v.isFeatured);
}

/**
 * Get videos by category
 */
export function getVideosByCategory(category: string): ManagedVideo[] {
  return getVideos().filter(v => v.category === category);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BOOK MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ManagedBook extends Book {
  /** URL to download/view the book (Google Drive, Dropbox, etc.) */
  downloadUrl?: string;
  /** Sort order for display */
  sortOrder?: number;
  /** ISBN if available */
  isbn?: string;
  /** Language */
  language?: string;
  /** Created timestamp */
  createdAt: string;
  /** Updated timestamp */
  updatedAt: string;
}

/**
 * Get all books from localStorage
 */
export function getBooks(): ManagedBook[] {
  if (typeof window === 'undefined') return [];
  initializeContentIfNeeded();
  try {
    const data = localStorage.getItem(BOOKS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ManagedBook[];
  } catch {
    return [];
  }
}

/**
 * Save books to localStorage
 */
export function saveBooks(books: ManagedBook[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
}

/**
 * Add a new book
 */
export function addBook(book: Omit<ManagedBook, 'id' | 'createdAt' | 'updatedAt'>): ManagedBook {
  const books = getBooks();
  const now = new Date().toISOString();
  const newBook: ManagedBook = {
    ...book,
    id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };
  books.push(newBook);
  saveBooks(books);
  return newBook;
}

/**
 * Update a book
 */
export function updateBook(id: string, updates: Partial<ManagedBook>): ManagedBook | null {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return null;
  books[index] = { 
    ...books[index], 
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveBooks(books);
  return books[index];
}

/**
 * Delete a book
 */
export function deleteBook(id: string): boolean {
  const books = getBooks();
  const filtered = books.filter(b => b.id !== id);
  if (filtered.length === books.length) return false;
  saveBooks(filtered);
  return true;
}

/**
 * Get featured books
 */
export function getFeaturedBooks(): ManagedBook[] {
  return getBooks().filter(b => b.isFeatured);
}

/**
 * Get books by category
 */
export function getBooksByCategory(category: string): ManagedBook[] {
  return getBooks().filter(b => b.category === category);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATEGORY HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const VIDEO_CATEGORIES = [
  'teaching',
  'sermon',
  'prayer',
  'prophecy',
  'worship',
  'testimony',
  'conference',
  'devotional',
  'other',
] as const;

export const BOOK_CATEGORIES = [
  'teaching',
  'devotional',
  'prayer',
  'prophecy',
  'christian-living',
  'bible-study',
  'biography',
  'other',
] as const;

export type VideoCategory = typeof VIDEO_CATEGORIES[number];
export type BookCategory = typeof BOOK_CATEGORIES[number];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESET FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Reset all content to defaults (re-initialize from mock data)
 */
export function resetToDefaultContent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(VIDEOS_STORAGE_KEY);
  localStorage.removeItem(BOOKS_STORAGE_KEY);
  localStorage.removeItem(INITIALIZED_KEY);
  initializeContentIfNeeded();
}

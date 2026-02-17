export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  speaker: string;
  date: string;
  series?: string;
  category: string;
  views: number;
  isLive?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  category: string;
  pages: number;
  year: number;
  downloads?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  date: string;
  time: string;
  isLive: boolean;
  speaker: string;
  thumbnail: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  watchHistory: string[];
  savedItems: string[];
  donations: Donation[];
  createdAt: string;
}

export interface Donation {
  id: string;
  amount: number;
  type: 'tithe' | 'offering' | 'partnership';
  date: string;
  message?: string;
}

export interface ContentRow {
  title: string;
  items: Video[];
}

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  videoCount: number;
  color: string;
  isNew?: boolean;
  isTrending?: boolean;
  lastUpdated?: string;
  previewVideos?: string[]; // thumbnail URLs for preview
  totalDuration?: number; // total hours of content
  recentlyAddedCount?: number; // videos added in last 7 days
}

export interface ContinueWatchingItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  categoryId: string;
  categoryName: string;
  progress: number; // 0-100 percentage
  duration: number; // minutes
  lastWatched: string;
}

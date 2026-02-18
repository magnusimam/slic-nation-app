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

// Live Streaming Types
export type StreamPlatform = 'youtube' | 'facebook' | 'none';

export interface StreamConfig {
  platform: StreamPlatform;
  youtubeVideoId?: string;      // YouTube video/stream ID (from URL: youtube.com/watch?v=THIS_PART)
  youtubeLiveChannelId?: string; // YouTube channel ID for auto-detecting live streams
  facebookVideoUrl?: string;     // Full Facebook video/live URL
  isLive: boolean;               // Manual override for live status
  title?: string;                // Stream title override
  fallbackThumbnail?: string;    // Thumbnail when offline
}

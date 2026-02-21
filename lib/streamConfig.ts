import { StreamConfig, ChatConfig } from './types';

/**
 * SLIC Nations Live Stream Configuration — Default Values
 * 
 * These defaults are used as fallbacks. The actual config is managed
 * from the Admin Settings page (/stream-settings) and stored in localStorage.
 * 
 * To go live:
 *   1. Go to /stream-settings
 *   2. Set your YouTube Video ID or Facebook URL
 *   3. Toggle "Stream Status" to LIVE
 *   4. Click "Save & Apply Settings"
 *   5. The /live page will update automatically
 */

// Default chat configuration
export const defaultChatConfig: ChatConfig = {
  enabled: true,
  source: 'youtube-embed',  // Recommended: embeds native YouTube chat (no API quota)
  approvalMode: 'auto',
  showViewerCount: true,
  allowGuestComments: false,
  slowModeSeconds: 0,
  maxMessageLength: 500,
  blockedWords: [],
  welcomeMessage: 'Welcome to the live service! 🙏 Feel free to share your prayers and comments.',
};

export const streamConfig: StreamConfig = {
  // Default platform
  platform: 'youtube',
  
  // YouTube video ID — set via Admin Settings page (/stream-settings)
  youtubeVideoId: '',
  
  // YouTube channel ID for auto-detecting live streams
  youtubeLiveChannelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || '',
  
  // Facebook video URL — set via Admin Settings page
  facebookVideoUrl: '',
  
  // Live status — controlled from Admin Settings page
  isLive: false,
  
  // Override stream title (leave empty to auto-pull from YouTube)
  title: '',
  
  // Fallback thumbnail when offline
  fallbackThumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1280&h=720&fit=crop',
  
  // Live chat configuration
  chat: defaultChatConfig,
};

/**
 * Helper to get the YouTube embed URL
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay = false): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    controls: '1',
    playsinline: '1',
    enablejsapi: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : '',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Helper to get YouTube live embed by channel ID
 */
export function getYouTubeLiveByChannelUrl(channelId: string): string {
  return `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&modestbranding=1`;
}

/**
 * Helper to get Facebook embed URL
 */
export function getFacebookEmbedUrl(videoUrl: string, autoplay = false): string {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&autoplay=${autoplay}&width=720`;
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

import { StreamConfig } from './types';

/**
 * SLIC Nations Live Stream Configuration
 * 
 * HOW TO USE:
 * 
 * 1. YouTube Live:
 *    - Go to YouTube Studio → Go Live → Copy the stream URL
 *    - Your stream URL looks like: https://youtube.com/watch?v=XXXXXXX
 *    - Set youtubeVideoId to "XXXXXXX" (the part after v=)
 *    - Set platform to 'youtube'
 *    - Set isLive to true when you're streaming
 * 
 * 2. Facebook Live:
 *    - Go to Facebook → Live Video → Start streaming from OBS
 *    - Copy the video URL (e.g., https://www.facebook.com/yourpage/videos/123456)
 *    - Set facebookVideoUrl to the full URL
 *    - Set platform to 'facebook'
 *    - Set isLive to true when you're streaming
 * 
 * OBS Settings:
 *    YouTube: Settings → Stream → Service: YouTube → Paste Stream Key
 *    Facebook: Settings → Stream → Service: Facebook Live → Paste Stream Key
 */

export const streamConfig: StreamConfig = {
  // Change to 'youtube' or 'facebook' when ready to stream
  platform: 'youtube',
  
  // YouTube: paste your video/stream ID here
  // Example: for https://youtube.com/watch?v=dQw4w9WgXcQ → use 'dQw4w9WgXcQ'
  youtubeVideoId: '',
  
  // Optional: Your YouTube channel ID for auto-embed
  // Go to youtube.com/account_advanced to find your channel ID
  youtubeLiveChannelId: '',
  
  // Facebook: paste full video URL here
  // Example: 'https://www.facebook.com/SLICNations/videos/123456789'
  facebookVideoUrl: '',
  
  // Set to true when you start streaming, false when done
  isLive: false,
  
  // Override stream title (leave empty to use service title)
  title: '',
  
  // Fallback thumbnail when offline
  fallbackThumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1280&h=720&fit=crop',
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

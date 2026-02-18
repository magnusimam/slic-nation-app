/**
 * YouTube Data API v3 Service
 * 
 * Pulls live stream details automatically:
 * - Title, description, thumbnail
 * - Live status & viewer count
 * - Live chat messages
 * - Channel info
 * - Recent live streams (replays)
 */

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface YouTubeVideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailHigh: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  liveBroadcastContent: 'live' | 'upcoming' | 'none';
  scheduledStartTime?: string;
  actualStartTime?: string;
  concurrentViewers?: number;
  likeCount?: number;
  activeLiveChatId?: string;
  tags?: string[];
  duration?: string;
}

export interface YouTubeChatMessage {
  id: string;
  authorName: string;
  authorAvatar: string;
  message: string;
  publishedAt: string;
  isModerator: boolean;
  isOwner: boolean;
  isMember: boolean;
}

export interface YouTubeChannelInfo {
  id: string;
  title: string;
  description: string;
  avatar: string;
  subscriberCount: number;
  customUrl?: string;
}

export interface YouTubeSearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  liveBroadcastContent: 'live' | 'upcoming' | 'none';
}

// ─── API Functions ──────────────────────────────────────────────────────────

/**
 * Get video details by video ID
 */
export async function getVideoDetails(videoId: string): Promise<YouTubeVideoDetails | null> {
  try {
    const params = new URLSearchParams({
      part: 'snippet,statistics,liveStreamingDetails',
      id: videoId,
      key: API_KEY,
    });

    const res = await fetch(`${BASE_URL}/videos?${params}`);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

    const data = await res.json();
    if (!data.items?.length) return null;

    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
      thumbnailHigh: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      liveBroadcastContent: item.snippet.liveBroadcastContent || 'none',
      scheduledStartTime: item.liveStreamingDetails?.scheduledStartTime,
      actualStartTime: item.liveStreamingDetails?.actualStartTime,
      concurrentViewers: item.liveStreamingDetails?.concurrentViewers
        ? parseInt(item.liveStreamingDetails.concurrentViewers)
        : undefined,
      likeCount: item.statistics?.likeCount
        ? parseInt(item.statistics.likeCount)
        : undefined,
      activeLiveChatId: item.liveStreamingDetails?.activeLiveChatId,
      tags: item.snippet.tags,
      duration: item.contentDetails?.duration,
    };
  } catch (error) {
    console.error('Failed to fetch video details:', error);
    return null;
  }
}

/**
 * Search for the current live stream on a channel
 */
export async function findLiveStream(channelId: string): Promise<YouTubeSearchResult | null> {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId,
      eventType: 'live',
      type: 'video',
      key: API_KEY,
    });

    const res = await fetch(`${BASE_URL}/search?${params}`);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

    const data = await res.json();
    if (!data.items?.length) return null;

    const item = data.items[0];
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
      publishedAt: item.snippet.publishedAt,
      liveBroadcastContent: 'live',
    };
  } catch (error) {
    console.error('Failed to search for live stream:', error);
    return null;
  }
}

/**
 * Search for upcoming streams on a channel
 */
export async function findUpcomingStreams(channelId: string, maxResults = 5): Promise<YouTubeSearchResult[]> {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId,
      eventType: 'upcoming',
      type: 'video',
      maxResults: String(maxResults),
      key: API_KEY,
    });

    const res = await fetch(`${BASE_URL}/search?${params}`);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

    const data = await res.json();
    return (data.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
      publishedAt: item.snippet.publishedAt,
      liveBroadcastContent: 'upcoming' as const,
    }));
  } catch (error) {
    console.error('Failed to search for upcoming streams:', error);
    return [];
  }
}

/**
 * Get recent completed live streams (replays) from a channel
 */
export async function getRecentStreams(channelId: string, maxResults = 5): Promise<YouTubeSearchResult[]> {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId,
      eventType: 'completed',
      type: 'video',
      order: 'date',
      maxResults: String(maxResults),
      key: API_KEY,
    });

    const res = await fetch(`${BASE_URL}/search?${params}`);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

    const data = await res.json();
    return (data.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
      publishedAt: item.snippet.publishedAt,
      liveBroadcastContent: 'none' as const,
    }));
  } catch (error) {
    console.error('Failed to fetch recent streams:', error);
    return [];
  }
}

/**
 * Get live chat messages
 */
export async function getLiveChatMessages(
  liveChatId: string,
  pageToken?: string
): Promise<{
  messages: YouTubeChatMessage[];
  nextPageToken?: string;
  pollingIntervalMs: number;
}> {
  try {
    const params = new URLSearchParams({
      part: 'snippet,authorDetails',
      liveChatId,
      maxResults: '200',
      key: API_KEY,
    });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`${BASE_URL}/liveChat/messages?${params}`);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

    const data = await res.json();

    const messages: YouTubeChatMessage[] = (data.items || []).map((item: any) => ({
      id: item.id,
      authorName: item.authorDetails.displayName,
      authorAvatar: item.authorDetails.profileImageUrl,
      message: item.snippet.displayMessage || item.snippet.textMessageDetails?.messageText || '',
      publishedAt: item.snippet.publishedAt,
      isModerator: item.authorDetails.isChatModerator,
      isOwner: item.authorDetails.isChatOwner,
      isMember: item.authorDetails.isChatSponsor,
    }));

    return {
      messages,
      nextPageToken: data.nextPageToken,
      pollingIntervalMs: data.pollingIntervalMillis || 10000,
    };
  } catch (error) {
    console.error('Failed to fetch chat messages:', error);
    return { messages: [], pollingIntervalMs: 10000 };
  }
}

/**
 * Get channel info
 */
export async function getChannelInfo(channelId: string): Promise<YouTubeChannelInfo | null> {
  try {
    const params = new URLSearchParams({
      part: 'snippet,statistics',
      id: channelId,
      key: API_KEY,
    });

    const res = await fetch(`${BASE_URL}/channels?${params}`);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

    const data = await res.json();
    if (!data.items?.length) return null;

    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      avatar: item.snippet.thumbnails?.medium?.url || '',
      subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
      customUrl: item.snippet.customUrl,
    };
  } catch (error) {
    console.error('Failed to fetch channel info:', error);
    return null;
  }
}

/**
 * Check if API key is configured
 */
export function isYouTubeConfigured(): boolean {
  return !!API_KEY && API_KEY.length > 10;
}

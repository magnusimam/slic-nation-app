'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getVideoDetails,
  findLiveStream,
  getLiveChatMessages,
  getRecentStreams,
  findUpcomingStreams,
  isYouTubeConfigured,
  type YouTubeVideoDetails,
  type YouTubeChatMessage,
  type YouTubeSearchResult,
} from '@/lib/youtube';

interface UseYouTubeLiveOptions {
  /** Specific video/stream ID to monitor */
  videoId?: string;
  /** Channel ID to auto-detect live streams */
  channelId?: string;
  /** How often to poll for live status updates (ms), default 30s */
  pollInterval?: number;
  /** Enable live chat polling */
  enableChat?: boolean;
  /** Fetch recent completed streams */
  fetchReplays?: boolean;
  /** Fetch upcoming scheduled streams */
  fetchUpcoming?: boolean;
}

interface UseYouTubeLiveReturn {
  /** Current stream details (title, description, viewer count, etc.) */
  stream: YouTubeVideoDetails | null;
  /** Whether a live stream is currently active */
  isLive: boolean;
  /** Whether we're still loading initial data */
  isLoading: boolean;
  /** Any error that occurred */
  error: string | null;
  /** Live chat messages from YouTube */
  chatMessages: YouTubeChatMessage[];
  /** The detected live video ID (from search or provided) */
  liveVideoId: string | null;
  /** Recent completed streams (replays) */
  replays: YouTubeSearchResult[];
  /** Upcoming scheduled streams */
  upcoming: YouTubeSearchResult[];
  /** Whether YouTube API is configured */
  isConfigured: boolean;
  /** Force refresh the data */
  refresh: () => void;
}

export function useYouTubeLive(options: UseYouTubeLiveOptions = {}): UseYouTubeLiveReturn {
  const {
    videoId,
    channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || '',
    pollInterval = 30000,
    enableChat = true,
    fetchReplays = true,
    fetchUpcoming = true,
  } = options;

  const [stream, setStream] = useState<YouTubeVideoDetails | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<YouTubeChatMessage[]>([]);
  const [liveVideoId, setLiveVideoId] = useState<string | null>(videoId || null);
  const [replays, setReplays] = useState<YouTubeSearchResult[]>([]);
  const [upcoming, setUpcoming] = useState<YouTubeSearchResult[]>([]);

  const chatPageTokenRef = useRef<string | undefined>(undefined);
  const chatPollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isConfigured = isYouTubeConfigured();

  // ─── Detect Live Stream ─────────────────────────────────────────────────

  const detectLiveStream = useCallback(async () => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      // If a specific video ID is provided, check it directly
      if (videoId) {
        const details = await getVideoDetails(videoId);
        if (details) {
          setStream(details);
          const live = details.liveBroadcastContent === 'live';
          setIsLive(live);
          setLiveVideoId(videoId);
          setError(null);
        }
        setIsLoading(false);
        return;
      }

      // Otherwise, search for active live stream on the channel
      if (channelId) {
        const liveResult = await findLiveStream(channelId);

        if (liveResult) {
          setLiveVideoId(liveResult.id);
          // Fetch full details for the live stream
          const details = await getVideoDetails(liveResult.id);
          if (details) {
            setStream(details);
            setIsLive(true);
            setError(null);
          }
        } else {
          // No live stream found — check if there was a previous live stream
          setIsLive(false);
          setLiveVideoId(null);
          // Keep the last stream details if we had them
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error detecting live stream:', err);
      setError('Failed to check live status');
      setIsLoading(false);
    }
  }, [videoId, channelId, isConfigured]);

  // ─── Fetch Replays & Upcoming ───────────────────────────────────────────

  const fetchSidebarData = useCallback(async () => {
    if (!isConfigured || !channelId) return;

    try {
      const [replayResults, upcomingResults] = await Promise.all([
        fetchReplays ? getRecentStreams(channelId, 5) : Promise.resolve([]),
        fetchUpcoming ? findUpcomingStreams(channelId, 5) : Promise.resolve([]),
      ]);

      setReplays(replayResults);
      setUpcoming(upcomingResults);
    } catch (err) {
      console.error('Error fetching sidebar data:', err);
    }
  }, [channelId, isConfigured, fetchReplays, fetchUpcoming]);

  // ─── Poll Live Chat ─────────────────────────────────────────────────────

  const pollChat = useCallback(async () => {
    if (!stream?.activeLiveChatId || !enableChat || !isLive) return;

    try {
      const result = await getLiveChatMessages(
        stream.activeLiveChatId,
        chatPageTokenRef.current
      );

      if (result.messages.length > 0) {
        setChatMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMessages = result.messages.filter(m => !existingIds.has(m.id));
          if (newMessages.length === 0) return prev;
          // Keep last 100 messages
          return [...prev, ...newMessages].slice(-100);
        });
      }

      chatPageTokenRef.current = result.nextPageToken;

      // Schedule next poll based on YouTube's recommended interval
      chatPollTimerRef.current = setTimeout(pollChat, result.pollingIntervalMs);
    } catch (err) {
      console.error('Error polling chat:', err);
      // Retry after 15s on error
      chatPollTimerRef.current = setTimeout(pollChat, 15000);
    }
  }, [stream?.activeLiveChatId, enableChat, isLive]);

  // ─── Effects ────────────────────────────────────────────────────────────

  // Initial load + periodic polling for live status
  useEffect(() => {
    detectLiveStream();
    fetchSidebarData();

    const interval = setInterval(detectLiveStream, pollInterval);
    return () => clearInterval(interval);
  }, [detectLiveStream, fetchSidebarData, pollInterval]);

  // Start/stop chat polling based on live status
  useEffect(() => {
    if (isLive && stream?.activeLiveChatId && enableChat) {
      // Reset chat state for new live stream
      chatPageTokenRef.current = undefined;
      pollChat();
    }

    return () => {
      if (chatPollTimerRef.current) {
        clearTimeout(chatPollTimerRef.current);
        chatPollTimerRef.current = null;
      }
    };
  }, [isLive, stream?.activeLiveChatId, enableChat, pollChat]);

  // ─── Refresh ────────────────────────────────────────────────────────────

  const refresh = useCallback(() => {
    setIsLoading(true);
    chatPageTokenRef.current = undefined;
    setChatMessages([]);
    detectLiveStream();
    fetchSidebarData();
  }, [detectLiveStream, fetchSidebarData]);

  return {
    stream,
    isLive,
    isLoading,
    error,
    chatMessages,
    liveVideoId,
    replays,
    upcoming,
    isConfigured,
    refresh,
  };
}

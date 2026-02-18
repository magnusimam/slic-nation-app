'use client';

import { useState, useRef, useEffect } from 'react';
import { StreamConfig } from '@/lib/types';
import {
  getYouTubeEmbedUrl,
  getYouTubeLiveByChannelUrl,
  getFacebookEmbedUrl,
} from '@/lib/streamConfig';
import {
  Play,
  Radio,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Settings,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LiveStreamPlayerProps {
  config: StreamConfig;
  fallbackThumbnail?: string;
  serviceThumbnail?: string;
  onLiveStatusChange?: (isLive: boolean) => void;
}

export function LiveStreamPlayer({
  config,
  fallbackThumbnail,
  serviceThumbnail,
  onLiveStatusChange,
}: LiveStreamPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('offline');

  const isStreamReady = config.isLive && config.platform !== 'none' && (
    (config.platform === 'youtube' && (config.youtubeVideoId || config.youtubeLiveChannelId)) ||
    (config.platform === 'facebook' && config.facebookVideoUrl)
  );

  useEffect(() => {
    if (isStreamReady) {
      setConnectionStatus('connecting');
      const timer = setTimeout(() => setConnectionStatus('connected'), 2000);
      return () => clearTimeout(timer);
    } else {
      setConnectionStatus('offline');
    }
  }, [isStreamReady]);

  useEffect(() => {
    onLiveStatusChange?.(!!isStreamReady);
  }, [isStreamReady, onLiveStatusChange]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const getEmbedUrl = (): string | null => {
    if (config.platform === 'youtube') {
      if (config.youtubeVideoId) {
        return getYouTubeEmbedUrl(config.youtubeVideoId, true);
      }
      if (config.youtubeLiveChannelId) {
        return getYouTubeLiveByChannelUrl(config.youtubeLiveChannelId);
      }
    }
    if (config.platform === 'facebook' && config.facebookVideoUrl) {
      return getFacebookEmbedUrl(config.facebookVideoUrl, true);
    }
    return null;
  };

  const handlePlay = () => {
    setHasStarted(true);
    setShowOverlay(false);
  };

  const thumbnail = serviceThumbnail || fallbackThumbnail || config.fallbackThumbnail || '';

  // OFFLINE STATE - Show thumbnail with offline message
  if (!isStreamReady) {
    return (
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden bg-black aspect-video group"
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${thumbnail}')` }}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Offline Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white space-y-4 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <WifiOff className="w-8 h-8 sm:w-10 sm:h-10 text-white/70" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg sm:text-xl font-bold">Stream Offline</h3>
            <p className="text-sm text-white/60 max-w-sm">
              No live stream currently active. Check back during scheduled service times.
            </p>
          </div>
          <Badge variant="outline" className="text-white/70 border-white/30">
            <WifiOff className="w-3 h-3 mr-1.5" />
            Offline
          </Badge>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl();

  // LIVE STATE - Show embedded player
  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden bg-black aspect-video group"
    >
      {/* Pre-play overlay */}
      {showOverlay && !hasStarted && (
        <div className="absolute inset-0 z-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${thumbnail}')` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white space-y-4">
            {/* Live Badge */}
            <Badge className="bg-red-600 text-white border-0 animate-pulse px-3 py-1">
              <Radio className="w-3 h-3 mr-1.5" />
              LIVE NOW
            </Badge>

            {/* Play Button */}
            <button
              onClick={handlePlay}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
            >
              <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white ml-1" />
            </button>

            <p className="text-sm text-white/80 font-medium">
              Tap to join live stream
            </p>

            {/* Connection Status */}
            <div className="flex items-center gap-2 text-xs text-white/60">
              {connectionStatus === 'connecting' && (
                <>
                  <Wifi className="w-3 h-3 animate-pulse" />
                  Connecting...
                </>
              )}
              {connectionStatus === 'connected' && (
                <>
                  <Wifi className="w-3 h-3 text-green-400" />
                  Stream ready
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Player */}
      {hasStarted && embedUrl && (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          title={config.title || 'SLIC Nations Live Stream'}
        />
      )}

      {/* Top bar - Live badge & controls */}
      {hasStarted && (
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-start justify-between z-10 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge className="bg-red-600 text-white border-0 animate-pulse">
            <Radio className="w-3 h-3 mr-1.5" />
            LIVE
          </Badge>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Platform Watermark */}
      {hasStarted && (
        <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="outline" className="text-white/60 border-white/20 text-xs bg-black/30 backdrop-blur-sm">
            {config.platform === 'youtube' ? '▶ YouTube Live' : '📘 Facebook Live'}
          </Badge>
        </div>
      )}
    </div>
  );
}

import { StreamConfig, StreamPlatform, ChatConfig } from './types';
import { streamConfig as defaultConfig, defaultChatConfig } from './streamConfig';

const STORAGE_KEY = 'slic-stream-config';

/**
 * Stream Config Manager
 * 
 * Reads/writes stream configuration to localStorage so the admin
 * settings page can update it without touching code files.
 * Falls back to the hardcoded default in lib/streamConfig.ts.
 */

/**
 * Get the active stream config (localStorage → fallback to default)
 */
export function getStreamConfig(): StreamConfig {
  if (typeof window === 'undefined') return defaultConfig;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StreamConfig;
      // Merge with defaults so new fields are always present
      return {
        ...defaultConfig,
        ...parsed,
        // Always use env channel ID as fallback
        youtubeLiveChannelId:
          parsed.youtubeLiveChannelId ||
          defaultConfig.youtubeLiveChannelId,
        // Merge chat config with defaults
        chat: {
          ...defaultChatConfig,
          ...(parsed.chat || {}),
        },
      };
    }
  } catch (err) {
    console.error('Failed to read stream config from localStorage:', err);
  }

  return defaultConfig;
}

/**
 * Save stream config to localStorage
 */
export function saveStreamConfig(config: Partial<StreamConfig>): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getStreamConfig();
    const updated: StreamConfig = {
      ...current,
      ...config,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save stream config to localStorage:', err);
  }
}

/**
 * Update individual stream config fields
 */
export function updateStreamField<K extends keyof StreamConfig>(
  key: K,
  value: StreamConfig[K]
): void {
  saveStreamConfig({ [key]: value });
}

/**
 * Toggle live status on/off
 */
export function toggleLiveStatus(isLive?: boolean): boolean {
  const current = getStreamConfig();
  const newStatus = isLive !== undefined ? isLive : !current.isLive;
  saveStreamConfig({ isLive: newStatus });
  return newStatus;
}

/**
 * Quick-set for going live (sets video ID + toggles live)
 */
export function goLive(options: {
  platform?: StreamPlatform;
  youtubeVideoId?: string;
  facebookVideoUrl?: string;
}): void {
  saveStreamConfig({
    isLive: true,
    ...options,
  });
}

/**
 * Quick-set for going offline
 */
export function goOffline(): void {
  saveStreamConfig({ isLive: false });
}

/**
 * Reset to default config (clears localStorage)
 */
export function resetStreamConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if a custom config has been saved
 */
export function hasCustomConfig(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

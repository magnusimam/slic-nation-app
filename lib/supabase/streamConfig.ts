/**
 * Supabase Stream Config Service
 * 
 * Replaces localStorage streamConfigManager.
 * Uses a singleton row (id='default') in stream_config table.
 */

import { createClient } from './client'
import type { StreamConfigRow } from './types'
import type { StreamConfig, ChatConfig } from '../types'
import { defaultChatConfig } from '../streamConfig'

/** Convert DB row to app StreamConfig */
function rowToStreamConfig(row: StreamConfigRow): StreamConfig {
  const chatConfig = (typeof row.chat_config === 'object' && row.chat_config !== null)
    ? row.chat_config as unknown as ChatConfig
    : defaultChatConfig

  return {
    platform: row.platform,
    youtubeVideoId: row.youtube_video_id ?? undefined,
    youtubeLiveChannelId: row.youtube_live_channel_id ?? undefined,
    facebookVideoUrl: row.facebook_video_url ?? undefined,
    isLive: row.is_live,
    title: row.title ?? undefined,
    fallbackThumbnail: row.fallback_thumbnail ?? undefined,
    chat: { ...defaultChatConfig, ...chatConfig },
  }
}

/** Get the current stream config */
export async function getStreamConfig(): Promise<StreamConfig> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('stream_config')
    .select('*')
    .eq('id', 'default')
    .single()

  if (error || !data) {
    // Return default if not found
    const { streamConfig: defaultConfig } = await import('../streamConfig')
    return defaultConfig
  }

  return rowToStreamConfig(data)
}

/** Save/update stream config */
export async function saveStreamConfig(config: Partial<StreamConfig>) {
  const supabase = createClient()
  
  const row: Record<string, unknown> = { id: 'default' }
  if (config.platform !== undefined) row.platform = config.platform
  if (config.youtubeVideoId !== undefined) row.youtube_video_id = config.youtubeVideoId || null
  if (config.youtubeLiveChannelId !== undefined) row.youtube_live_channel_id = config.youtubeLiveChannelId || null
  if (config.facebookVideoUrl !== undefined) row.facebook_video_url = config.facebookVideoUrl || null
  if (config.isLive !== undefined) row.is_live = config.isLive
  if (config.title !== undefined) row.title = config.title || null
  if (config.fallbackThumbnail !== undefined) row.fallback_thumbnail = config.fallbackThumbnail || null
  if (config.chat !== undefined) row.chat_config = config.chat

  const { error } = await supabase
    .from('stream_config')
    .upsert(row)

  if (error) throw error
}

/** Toggle live status */
export async function toggleLiveStatus(isLive?: boolean): Promise<boolean> {
  if (isLive === undefined) {
    const current = await getStreamConfig()
    isLive = !current.isLive
  }
  await saveStreamConfig({ isLive })
  return isLive
}

/** Go live */
export async function goLive(options?: {
  platform?: StreamConfig['platform']
  youtubeVideoId?: string
  facebookVideoUrl?: string
}) {
  await saveStreamConfig({
    isLive: true,
    ...options,
  })
}

/** Go offline */
export async function goOffline() {
  await saveStreamConfig({ isLive: false })
}

/**
 * Supabase Videos Service
 * 
 * CRUD operations for videos, replaces localStorage contentManager (video part).
 */

import { createClient } from './client'
import type { VideoRow } from './types'
import type { Video } from '../types'

// ────────────────────────────────────────────────
// Type Converters (DB row ↔ App type)
// ────────────────────────────────────────────────

/** Convert Supabase row to app Video type */
export function rowToVideo(row: VideoRow): Video & {
  youtubeId?: string | null
  videoUrl?: string | null
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
} {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    thumbnail: row.thumbnail,
    duration: row.duration,
    speaker: row.speaker,
    date: row.date,
    series: row.series ?? undefined,
    category: row.category,
    views: row.views,
    isLive: row.is_live,
    youtubeId: row.youtube_id,
    videoUrl: row.video_url,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Convert app video data to DB insert format */
function videoToRow(video: Partial<Video> & {
  youtubeId?: string | null
  videoUrl?: string | null
  isFeatured?: boolean
  sortOrder?: number
}): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (video.title !== undefined) row.title = video.title
  if (video.description !== undefined) row.description = video.description
  if (video.thumbnail !== undefined) row.thumbnail = video.thumbnail
  if (video.duration !== undefined) row.duration = video.duration
  if (video.speaker !== undefined) row.speaker = video.speaker
  if (video.date !== undefined) row.date = video.date
  if (video.series !== undefined) row.series = video.series || null
  if (video.category !== undefined) row.category = video.category
  if (video.views !== undefined) row.views = video.views
  if (video.isLive !== undefined) row.is_live = video.isLive
  if (video.youtubeId !== undefined) row.youtube_id = video.youtubeId
  if (video.videoUrl !== undefined) row.video_url = video.videoUrl
  if (video.isFeatured !== undefined) row.is_featured = video.isFeatured
  if (video.sortOrder !== undefined) row.sort_order = video.sortOrder
  return row
}

// ────────────────────────────────────────────────
// CRUD Operations
// ────────────────────────────────────────────────

/** Get all videos */
export async function getVideos() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToVideo)
}

/** Get a single video by ID */
export async function getVideo(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data ? rowToVideo(data) : null
}

/** Get featured videos */
export async function getFeaturedVideos() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map(rowToVideo)
}

/** Get videos by category */
export async function getVideosByCategory(category: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('category', category)
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToVideo)
}

/** Add a new video */
export async function addVideo(video: Omit<Video, 'id'> & {
  youtubeId?: string | null
  videoUrl?: string | null
  isFeatured?: boolean
}) {
  const supabase = createClient()
  const row = videoToRow(video)
  
  const { data, error } = await supabase
    .from('videos')
    .insert(row)
    .select()
    .single()

  if (error) throw error
  return data ? rowToVideo(data) : null
}

/** Update a video */
export async function updateVideo(id: string, updates: Partial<Video> & {
  youtubeId?: string | null
  videoUrl?: string | null
  isFeatured?: boolean
}) {
  const supabase = createClient()
  const row = videoToRow(updates)
  
  const { data, error } = await supabase
    .from('videos')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data ? rowToVideo(data) : null
}

/** Delete a video */
export async function deleteVideo(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

/** Increment video view count */
export async function incrementViews(id: string) {
  const supabase = createClient()
  // Use RPC or just fetch + update
  const { data: video } = await supabase
    .from('videos')
    .select('views')
    .eq('id', id)
    .single()

  if (video) {
    await supabase
      .from('videos')
      .update({ views: video.views + 1 })
      .eq('id', id)
  }
}

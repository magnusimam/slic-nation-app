/**
 * Supabase Watch History & Saved Items Service
 */

import { createClient } from './client'

// ────────────────────────────────────────────────
// WATCH HISTORY
// ────────────────────────────────────────────────

export interface WatchHistoryItem {
  id: string
  videoId: string
  progress: number
  duration: number
  lastWatched: string
}

/** Get current user's watch history */
export async function getWatchHistory(): Promise<WatchHistoryItem[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('watch_history')
    .select('*')
    .eq('user_id', user.id)
    .order('last_watched', { ascending: false })

  if (error) return []
  return (data ?? []).map(row => ({
    id: row.id,
    videoId: row.video_id,
    progress: row.progress,
    duration: row.duration,
    lastWatched: row.last_watched,
  }))
}

/** Update or create watch history entry */
export async function upsertWatchProgress(videoId: string, progress: number, duration: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('watch_history')
    .upsert({
      user_id: user.id,
      video_id: videoId,
      progress,
      duration,
      last_watched: new Date().toISOString(),
    }, {
      onConflict: 'user_id,video_id',
    })
    .select()
    .single()

  if (error) return null
  return data
}

// ────────────────────────────────────────────────
// SAVED ITEMS (Bookmarks)
// ────────────────────────────────────────────────

export interface SavedItem {
  id: string
  videoId: string | null
  bookId: string | null
  createdAt: string
}

/** Get current user's saved items */
export async function getSavedItems(): Promise<SavedItem[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []).map(row => ({
    id: row.id,
    videoId: row.video_id,
    bookId: row.book_id,
    createdAt: row.created_at,
  }))
}

/** Save a video */
export async function saveVideo(videoId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('saved_items')
    .upsert({
      user_id: user.id,
      video_id: videoId,
    }, {
      onConflict: 'user_id,video_id',
    })
    .select()
    .single()

  if (error) return null
  return data
}

/** Unsave a video */
export async function unsaveVideo(videoId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('user_id', user.id)
    .eq('video_id', videoId)

  return !error
}

/** Save a book */
export async function saveBook(bookId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('saved_items')
    .insert({
      user_id: user.id,
      book_id: bookId,
    })
    .select()
    .single()

  if (error) return null
  return data
}

/** Check if a video is saved */
export async function isVideoSaved(videoId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('video_id', videoId)
    .single()

  return !!data
}

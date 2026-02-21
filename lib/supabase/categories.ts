/**
 * Supabase Categories Service
 */

import { createClient } from './client'
import type { CategoryRow } from './types'
import type { Category } from '../types'

export function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    thumbnail: row.thumbnail,
    description: row.description,
    videoCount: row.video_count,
    color: row.color,
    isNew: row.is_new,
    isTrending: row.is_trending,
    lastUpdated: row.last_updated ?? undefined,
    previewVideos: row.preview_videos ?? undefined,
    totalDuration: row.total_duration ?? undefined,
    recentlyAddedCount: row.recently_added_count ?? undefined,
  }
}

export async function getCategories() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []).map(rowToCategory)
}

export async function getCategory(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data ? rowToCategory(data) : null
}

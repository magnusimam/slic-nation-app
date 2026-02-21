/**
 * Supabase Services (recurring + scheduled) Service
 */

import { createClient } from './client'
import type { RecurringServiceRow, ScheduledServiceRow } from './types'
import type { Service } from '../types'

// ────────────────────────────────────────────────
// RECURRING SERVICES
// ────────────────────────────────────────────────

export interface RecurringServiceData {
  id: string
  title: string
  dayOfWeek: number
  time: string
  durationHours: number
  speaker: string
  thumbnail: string
}

function rowToRecurring(row: RecurringServiceRow): RecurringServiceData {
  return {
    id: row.id,
    title: row.title,
    dayOfWeek: row.day_of_week,
    time: row.time,
    durationHours: Number(row.duration_hours),
    speaker: row.speaker,
    thumbnail: row.thumbnail,
  }
}

export async function getRecurringServices(): Promise<RecurringServiceData[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('recurring_services')
    .select('*')
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return (data ?? []).map(rowToRecurring)
}

export async function addRecurringService(service: Omit<RecurringServiceData, 'id'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('recurring_services')
    .insert({
      title: service.title,
      day_of_week: service.dayOfWeek,
      time: service.time,
      duration_hours: service.durationHours,
      speaker: service.speaker,
      thumbnail: service.thumbnail,
    })
    .select()
    .single()

  if (error) throw error
  return data ? rowToRecurring(data) : null
}

export async function updateRecurringService(id: string, updates: Partial<RecurringServiceData>) {
  const supabase = createClient()
  const row: Record<string, unknown> = {}
  if (updates.title !== undefined) row.title = updates.title
  if (updates.dayOfWeek !== undefined) row.day_of_week = updates.dayOfWeek
  if (updates.time !== undefined) row.time = updates.time
  if (updates.durationHours !== undefined) row.duration_hours = updates.durationHours
  if (updates.speaker !== undefined) row.speaker = updates.speaker
  if (updates.thumbnail !== undefined) row.thumbnail = updates.thumbnail

  const { data, error } = await supabase
    .from('recurring_services')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data ? rowToRecurring(data) : null
}

export async function deleteRecurringService(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('recurring_services')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// ────────────────────────────────────────────────
// SCHEDULED SERVICES (one-time)
// ────────────────────────────────────────────────

export interface ScheduledServiceData {
  id: string
  title: string
  date: string
  time: string
  isLive: boolean
  speaker: string
  thumbnail: string
  description?: string | null
  isSpecial: boolean
  createdAt: string
}

function rowToScheduled(row: ScheduledServiceRow): ScheduledServiceData {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time,
    isLive: row.is_live,
    speaker: row.speaker,
    thumbnail: row.thumbnail,
    description: row.description,
    isSpecial: row.is_special,
    createdAt: row.created_at,
  }
}

/** Convert scheduled service to the app Service type */
export function scheduledToService(s: ScheduledServiceData): Service {
  return {
    id: s.id,
    title: s.title,
    date: s.date,
    time: s.time,
    isLive: s.isLive,
    speaker: s.speaker,
    thumbnail: s.thumbnail,
  }
}

export async function getScheduledServices(): Promise<ScheduledServiceData[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('scheduled_services')
    .select('*')
    .order('date', { ascending: true })

  if (error) throw error
  return (data ?? []).map(rowToScheduled)
}

export async function getUpcomingScheduledServices(): Promise<ScheduledServiceData[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('scheduled_services')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })

  if (error) throw error
  return (data ?? []).map(rowToScheduled)
}

export async function addScheduledService(service: {
  title: string
  date: string
  time: string
  speaker: string
  thumbnail?: string
  description?: string
  isSpecial?: boolean
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('scheduled_services')
    .insert({
      title: service.title,
      date: service.date,
      time: service.time,
      speaker: service.speaker,
      thumbnail: service.thumbnail ?? '',
      description: service.description ?? null,
      is_special: service.isSpecial ?? false,
    })
    .select()
    .single()

  if (error) throw error
  return data ? rowToScheduled(data) : null
}

export async function updateScheduledService(id: string, updates: Partial<{
  title: string
  date: string
  time: string
  isLive: boolean
  speaker: string
  thumbnail: string
  description: string | null
  isSpecial: boolean
}>) {
  const supabase = createClient()
  const row: Record<string, unknown> = {}
  if (updates.title !== undefined) row.title = updates.title
  if (updates.date !== undefined) row.date = updates.date
  if (updates.time !== undefined) row.time = updates.time
  if (updates.isLive !== undefined) row.is_live = updates.isLive
  if (updates.speaker !== undefined) row.speaker = updates.speaker
  if (updates.thumbnail !== undefined) row.thumbnail = updates.thumbnail
  if (updates.description !== undefined) row.description = updates.description
  if (updates.isSpecial !== undefined) row.is_special = updates.isSpecial

  const { data, error } = await supabase
    .from('scheduled_services')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data ? rowToScheduled(data) : null
}

export async function deleteScheduledService(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('scheduled_services')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

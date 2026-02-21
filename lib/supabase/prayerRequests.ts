/**
 * Supabase Prayer Requests Service
 */

import { createClient } from './client'

export interface PrayerRequestInput {
  name: string
  email?: string
  request: string
  isAnonymous?: boolean
}

/** Submit a prayer request */
export async function submitPrayerRequest(input: PrayerRequestInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('prayer_requests')
    .insert({
      user_id: user?.id ?? null,
      name: input.isAnonymous ? 'Anonymous' : input.name,
      email: input.email ?? null,
      request: input.request,
      is_anonymous: input.isAnonymous ?? false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/** Get prayer requests for admin */
export async function getPrayerRequests() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

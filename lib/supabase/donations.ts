/**
 * Supabase Donations Service
 */

import { createClient } from './client'
import type { DonationRow } from './types'

export interface DonationInput {
  amount: number
  type: 'tithe' | 'offering' | 'partnership'
  donorName?: string
  donorEmail?: string
  message?: string
}

export function rowToDonation(row: DonationRow) {
  return {
    id: row.id,
    userId: row.user_id,
    amount: Number(row.amount),
    type: row.type,
    donorName: row.donor_name,
    donorEmail: row.donor_email,
    message: row.message,
    createdAt: row.created_at,
  }
}

/** Create a donation record */
export async function createDonation(input: DonationInput) {
  const supabase = createClient()
  
  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('donations')
    .insert({
      user_id: user?.id ?? null,
      amount: input.amount,
      type: input.type,
      donor_name: input.donorName ?? null,
      donor_email: input.donorEmail ?? null,
      message: input.message ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data ? rowToDonation(data) : null
}

/** Get donations for the current user */
export async function getUserDonations() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToDonation)
}

/** Get all donations (admin) */
export async function getAllDonations() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToDonation)
}

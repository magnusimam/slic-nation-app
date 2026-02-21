/**
 * Supabase Auth Service
 * 
 * Handles user authentication: signup, login, logout, session management.
 */

import { createClient } from './client'

export type AuthError = {
  message: string
  status?: number
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, name: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        full_name: name,
      },
    },
  })

  if (error) {
    return { error: { message: error.message, status: error.status } }
  }

  return { error: null }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: { message: error.message, status: error.status } }
  }

  return { error: null }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  const supabase = createClient()
  return supabase.auth.onAuthStateChange(callback)
}

/**
 * Reset password via email
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  })

  if (error) {
    return { error: { message: error.message, status: error.status } }
  }

  return { error: null }
}

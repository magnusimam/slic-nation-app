import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Use global variable to ensure true singleton across all module instances
// This prevents auth lock issues in production builds
const globalForSupabase = globalThis as unknown as {
  supabaseClient: ReturnType<typeof createBrowserClient<Database>> | undefined
}

export function createClient() {
  if (!globalForSupabase.supabaseClient) {
    globalForSupabase.supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Use unique storage key and disable URL detection to prevent lock conflicts
          storageKey: 'slic-nations-auth',
          detectSessionInUrl: false,
          persistSession: true,
          autoRefreshToken: true,
          flowType: 'pkce',
        }
      }
    )
  }
  return globalForSupabase.supabaseClient
}


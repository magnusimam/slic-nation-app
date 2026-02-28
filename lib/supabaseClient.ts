// Re-export the singleton Supabase client
// This file exists for backward compatibility
export { createClient } from './supabase/client'

// For code that expects a direct supabase instance
import { createClient } from './supabase/client'
export const supabase = createClient()

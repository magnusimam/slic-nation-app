/**
 * Supabase Database Types
 * 
 * TypeScript types matching the database schema.
 * These types are used by the Supabase client for type-safe queries.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          phone: string | null
          location: string | null
          role: 'user' | 'admin' | 'moderator'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          role?: 'user' | 'admin' | 'moderator'
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail: string
          duration: number
          speaker: string
          date: string
          series: string | null
          category: string
          views: number
          is_live: boolean
          youtube_id: string | null
          video_url: string | null
          is_featured: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          thumbnail?: string
          duration?: number
          speaker?: string
          date?: string
          series?: string | null
          category?: string
          views?: number
          is_live?: boolean
          youtube_id?: string | null
          video_url?: string | null
          is_featured?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          thumbnail?: string
          duration?: number
          speaker?: string
          date?: string
          series?: string | null
          category?: string
          views?: number
          is_live?: boolean
          youtube_id?: string | null
          video_url?: string | null
          is_featured?: boolean
          sort_order?: number
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          cover: string
          description: string
          category: string
          pages: number
          year: number
          downloads: number
          is_new: boolean
          is_featured: boolean
          download_url: string | null
          isbn: string | null
          language: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author?: string
          cover?: string
          description?: string
          category?: string
          pages?: number
          year?: number
          downloads?: number
          is_new?: boolean
          is_featured?: boolean
          download_url?: string | null
          isbn?: string | null
          language?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          author?: string
          cover?: string
          description?: string
          category?: string
          pages?: number
          year?: number
          downloads?: number
          is_new?: boolean
          is_featured?: boolean
          download_url?: string | null
          isbn?: string | null
          language?: string | null
          sort_order?: number
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          thumbnail: string
          description: string
          video_count: number
          color: string
          is_new: boolean
          is_trending: boolean
          last_updated: string | null
          preview_videos: string[] | null
          total_duration: number | null
          recently_added_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          thumbnail?: string
          description?: string
          video_count?: number
          color?: string
          is_new?: boolean
          is_trending?: boolean
          last_updated?: string | null
          preview_videos?: string[] | null
          total_duration?: number | null
          recently_added_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          thumbnail?: string
          description?: string
          video_count?: number
          color?: string
          is_new?: boolean
          is_trending?: boolean
          last_updated?: string | null
          preview_videos?: string[] | null
          total_duration?: number | null
          recently_added_count?: number | null
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          user_id: string | null
          amount: number
          type: 'tithe' | 'offering' | 'partnership'
          donor_name: string | null
          donor_email: string | null
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          amount: number
          type: 'tithe' | 'offering' | 'partnership'
          donor_name?: string | null
          donor_email?: string | null
          message?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string | null
          amount?: number
          type?: 'tithe' | 'offering' | 'partnership'
          donor_name?: string | null
          donor_email?: string | null
          message?: string | null
        }
      }
      recurring_services: {
        Row: {
          id: string
          title: string
          day_of_week: number
          time: string
          duration_hours: number
          speaker: string
          thumbnail: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          day_of_week: number
          time: string
          duration_hours?: number
          speaker?: string
          thumbnail?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          day_of_week?: number
          time?: string
          duration_hours?: number
          speaker?: string
          thumbnail?: string
          updated_at?: string
        }
      }
      scheduled_services: {
        Row: {
          id: string
          title: string
          date: string
          time: string
          is_live: boolean
          speaker: string
          thumbnail: string
          description: string | null
          is_special: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          time: string
          is_live?: boolean
          speaker?: string
          thumbnail?: string
          description?: string | null
          is_special?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          date?: string
          time?: string
          is_live?: boolean
          speaker?: string
          thumbnail?: string
          description?: string | null
          is_special?: boolean
          updated_at?: string
        }
      }
      stream_config: {
        Row: {
          id: string
          platform: 'youtube' | 'facebook' | 'none'
          youtube_video_id: string | null
          youtube_live_channel_id: string | null
          facebook_video_url: string | null
          is_live: boolean
          title: string | null
          fallback_thumbnail: string | null
          chat_config: Json
          updated_at: string
        }
        Insert: {
          id?: string
          platform?: 'youtube' | 'facebook' | 'none'
          youtube_video_id?: string | null
          youtube_live_channel_id?: string | null
          facebook_video_url?: string | null
          is_live?: boolean
          title?: string | null
          fallback_thumbnail?: string | null
          chat_config?: Json
          updated_at?: string
        }
        Update: {
          platform?: 'youtube' | 'facebook' | 'none'
          youtube_video_id?: string | null
          youtube_live_channel_id?: string | null
          facebook_video_url?: string | null
          is_live?: boolean
          title?: string | null
          fallback_thumbnail?: string | null
          chat_config?: Json
          updated_at?: string
        }
      }
      watch_history: {
        Row: {
          id: string
          user_id: string
          video_id: string
          progress: number
          duration: number
          last_watched: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          progress?: number
          duration?: number
          last_watched?: string
        }
        Update: {
          progress?: number
          duration?: number
          last_watched?: string
        }
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          video_id: string | null
          book_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id?: string | null
          book_id?: string | null
          created_at?: string
        }
        Update: {
          video_id?: string | null
          book_id?: string | null
        }
      }
      prayer_requests: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string | null
          request: string
          is_anonymous: boolean
          status: 'pending' | 'praying' | 'answered'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          request: string
          is_anonymous?: boolean
          status?: 'pending' | 'praying' | 'answered'
          created_at?: string
        }
        Update: {
          name?: string
          email?: string | null
          request?: string
          is_anonymous?: boolean
          status?: 'pending' | 'praying' | 'answered'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type VideoRow = Database['public']['Tables']['videos']['Row']
export type BookRow = Database['public']['Tables']['books']['Row']
export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type DonationRow = Database['public']['Tables']['donations']['Row']
export type RecurringServiceRow = Database['public']['Tables']['recurring_services']['Row']
export type ScheduledServiceRow = Database['public']['Tables']['scheduled_services']['Row']
export type StreamConfigRow = Database['public']['Tables']['stream_config']['Row']
export type WatchHistoryRow = Database['public']['Tables']['watch_history']['Row']
export type SavedItemRow = Database['public']['Tables']['saved_items']['Row']
export type PrayerRequestRow = Database['public']['Tables']['prayer_requests']['Row']

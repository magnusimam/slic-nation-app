/**
 * Supabase barrel export
 * 
 * Central import point for all Supabase services.
 * Usage: import { createClient, signIn, getVideos } from '@/lib/supabase'
 */

// Client
export { createClient } from './client'

// Auth
export { signUp, signIn, signOut, getCurrentUser, getSession, onAuthStateChange, resetPassword } from './auth'

// Profiles
export { getProfile, updateProfile, isAdmin, getProfileById } from './profiles'

// Videos
export { getVideos, getVideo, getFeaturedVideos, getVideosByCategory, addVideo, updateVideo, deleteVideo, incrementViews, rowToVideo } from './videos'

// Books
export { getBooks, getBook, getFeaturedBooks, getBooksByCategory, addBook, updateBook, deleteBook, rowToBook } from './books'

// Categories
export { getCategories, getCategory, rowToCategory } from './categories'

// Donations
export { createDonation, getUserDonations, getAllDonations } from './donations'

// Services (recurring + scheduled)
export {
  getRecurringServices, addRecurringService, updateRecurringService, deleteRecurringService,
  getScheduledServices, getUpcomingScheduledServices, addScheduledService, updateScheduledService, deleteScheduledService,
  scheduledToService,
} from './services'

// Stream Config
export { getStreamConfig, saveStreamConfig, toggleLiveStatus, goLive, goOffline } from './streamConfig'

// User Content (watch history, saved items)
export { getWatchHistory, upsertWatchProgress, getSavedItems, saveVideo, unsaveVideo, saveBook, isVideoSaved } from './userContent'

// Prayer Requests
export { submitPrayerRequest, getPrayerRequests } from './prayerRequests'

// Types
export type { Database, Profile, VideoRow, BookRow, CategoryRow, DonationRow, RecurringServiceRow, ScheduledServiceRow, StreamConfigRow, WatchHistoryRow, SavedItemRow, PrayerRequestRow } from './types'

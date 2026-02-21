import { Service } from './types';

/**
 * Recurring Schedule System
 * 
 * Automatically calculates the next occurrence of recurring services
 * based on the current date/time. No more hardcoded dates!
 * 
 * Services can be edited from admin settings and are stored in localStorage.
 */

const STORAGE_KEY = 'slic-nations-recurring-services';

export interface RecurringService {
  id: string;
  title: string;
  /** Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday */
  dayOfWeek: number;
  /** Time in 24-hour format "HH:mm" */
  time: string;
  /** Duration in hours (for determining when service is "live") */
  durationHours: number;
  speaker: string;
  thumbnail: string;
}

// Default recurring services (used if none saved in localStorage)
export const DEFAULT_RECURRING_SERVICES: RecurringService[] = [
  {
    id: 'sunday-morning',
    title: 'Sunday Morning Service',
    dayOfWeek: 0, // Sunday
    time: '09:00',
    durationHours: 3,
    speaker: 'Apst Emmanuel Etim',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop',
  },
  {
    id: 'wednesday-midweek',
    title: 'Wednesday Midweek Service',
    dayOfWeek: 3, // Wednesday
    time: '18:00',
    durationHours: 2,
    speaker: 'Apst Emmanuel Etim',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=800&h=450&fit=crop',
  },
];

/**
 * Get recurring services from localStorage (or defaults if not set)
 */
export function getRecurringServices(): RecurringService[] {
  if (typeof window === 'undefined') return DEFAULT_RECURRING_SERVICES;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_RECURRING_SERVICES;
    const services = JSON.parse(data) as RecurringService[];
    return services.length > 0 ? services : DEFAULT_RECURRING_SERVICES;
  } catch {
    return DEFAULT_RECURRING_SERVICES;
  }
}

/**
 * Save recurring services to localStorage
 */
export function saveRecurringServices(services: RecurringService[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

/**
 * Add a new recurring service
 */
export function addRecurringService(service: Omit<RecurringService, 'id'>): RecurringService {
  const services = getRecurringServices();
  const newService: RecurringService = {
    ...service,
    id: `service-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  services.push(newService);
  saveRecurringServices(services);
  return newService;
}

/**
 * Update a recurring service
 */
export function updateRecurringService(id: string, updates: Partial<RecurringService>): RecurringService | null {
  const services = getRecurringServices();
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return null;
  services[index] = { ...services[index], ...updates };
  saveRecurringServices(services);
  return services[index];
}

/**
 * Delete a recurring service
 */
export function deleteRecurringService(id: string): boolean {
  const services = getRecurringServices();
  const filtered = services.filter(s => s.id !== id);
  if (filtered.length === services.length) return false;
  saveRecurringServices(filtered);
  return true;
}

/**
 * Reset to default services
 */
export function resetToDefaultServices(): void {
  saveRecurringServices(DEFAULT_RECURRING_SERVICES);
}

// For backward compatibility - use getter function
export const RECURRING_SERVICES = DEFAULT_RECURRING_SERVICES;

/**
 * Get the next occurrence of a specific day of week from a given date
 */
function getNextDayOfWeek(date: Date, targetDay: number): Date {
  const result = new Date(date);
  const currentDay = result.getDay();
  let daysUntil = targetDay - currentDay;
  
  if (daysUntil < 0) {
    daysUntil += 7;
  } else if (daysUntil === 0) {
    // Same day - check if time has passed
    // We'll handle this in the main function
  }
  
  result.setDate(result.getDate() + daysUntil);
  return result;
}

/**
 * Parse time string "HH:mm" to hours and minutes
 */
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Format time for display (12-hour format with AM/PM)
 */
function formatTime(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Format date for display (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate the next occurrence of a recurring service
 * Returns the Service object with calculated date/time and isLive status
 */
export function getNextOccurrence(recurring: RecurringService, now: Date = new Date()): Service {
  const { hours, minutes } = parseTime(recurring.time);
  
  // Get next occurrence of this day
  let nextDate = getNextDayOfWeek(now, recurring.dayOfWeek);
  nextDate.setHours(hours, minutes, 0, 0);
  
  // If it's the same day but time has passed (including after service duration), get next week
  const serviceEndTime = new Date(nextDate);
  serviceEndTime.setHours(serviceEndTime.getHours() + recurring.durationHours);
  
  if (nextDate.getDay() === now.getDay() && now >= serviceEndTime) {
    // Service for today has ended, get next week's occurrence
    nextDate.setDate(nextDate.getDate() + 7);
  }
  
  // Check if currently live (service has started but not ended)
  const serviceStartTime = new Date(nextDate);
  const serviceEnd = new Date(nextDate);
  serviceEnd.setHours(serviceEnd.getHours() + recurring.durationHours);
  
  // For same-day services, check if we're in the live window
  let isLive = false;
  if (nextDate.getDay() === now.getDay()) {
    const todayServiceStart = new Date(now);
    todayServiceStart.setHours(hours, minutes, 0, 0);
    const todayServiceEnd = new Date(todayServiceStart);
    todayServiceEnd.setHours(todayServiceEnd.getHours() + recurring.durationHours);
    
    isLive = now >= todayServiceStart && now < todayServiceEnd;
    
    // If live, use today's date for the nextDate
    if (isLive) {
      nextDate = todayServiceStart;
    }
  }
  
  return {
    id: `${recurring.id}-${formatDate(nextDate)}`,
    title: recurring.title,
    date: formatDate(nextDate),
    time: formatTime(hours, minutes),
    isLive,
    speaker: recurring.speaker,
    thumbnail: recurring.thumbnail,
  };
}

/**
 * Get all upcoming services sorted by date/time
 * Returns the next occurrence of each recurring service
 */
export function getUpcomingRecurringServices(now: Date = new Date()): Service[] {
  const recurringServices = getRecurringServices();
  const services = recurringServices.map(recurring => getNextOccurrence(recurring, now));
  
  // Sort by date/time
  services.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  return services;
}

/**
 * Get the next upcoming service (closest to now)
 * This is what shows as the "main" service with countdown
 */
export function getNextUpcomingService(now: Date = new Date()): Service {
  const services = getUpcomingRecurringServices(now);
  
  // If any service is currently live, return it first
  const liveService = services.find(s => s.isLive);
  if (liveService) return liveService;
  
  // Otherwise return the soonest upcoming service
  return services[0];
}

/**
 * Get services for the next N weeks for display in upcoming section
 * Returns only ONE occurrence per recurring service (the next upcoming one)
 */
export function getServicesForWeeks(weeks: number = 4, now: Date = new Date()): Service[] {
  const recurringServices = getRecurringServices();
  
  // Get just the next occurrence of each recurring service
  const services = recurringServices.map(recurring => getNextOccurrence(recurring, now));
  
  // Sort by date/time
  services.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  return services;
}

/**
 * Calculate countdown to a service
 */
export function calculateCountdown(serviceDate: Date, now: Date = new Date()): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const diff = serviceDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total: diff };
}

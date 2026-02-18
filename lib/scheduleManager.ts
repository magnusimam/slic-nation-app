import { Service } from './types';

const STORAGE_KEY = 'slic-nations-schedules';

/**
 * Service Schedule Manager
 * 
 * Uses localStorage to persist service schedules.
 * The admin panel writes schedules, the live page reads them.
 */

export interface ScheduledService extends Service {
  /** Optional description for special services */
  description?: string;
  /** Whether this is a special/one-time service */
  isSpecial?: boolean;
  /** Created timestamp */
  createdAt: string;
}

/**
 * Get all saved schedules from localStorage
 */
export function getSchedules(): ScheduledService[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ScheduledService[];
  } catch {
    return [];
  }
}

/**
 * Save schedules to localStorage
 */
export function saveSchedules(schedules: ScheduledService[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

/**
 * Add a new service schedule
 */
export function addSchedule(service: Omit<ScheduledService, 'id' | 'createdAt'>): ScheduledService {
  const schedules = getSchedules();
  const newService: ScheduledService = {
    ...service,
    id: `sched-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  schedules.push(newService);
  saveSchedules(schedules);
  return newService;
}

/**
 * Update an existing schedule
 */
export function updateSchedule(id: string, updates: Partial<ScheduledService>): ScheduledService | null {
  const schedules = getSchedules();
  const index = schedules.findIndex(s => s.id === id);
  if (index === -1) return null;
  schedules[index] = { ...schedules[index], ...updates };
  saveSchedules(schedules);
  return schedules[index];
}

/**
 * Delete a schedule
 */
export function deleteSchedule(id: string): boolean {
  const schedules = getSchedules();
  const filtered = schedules.filter(s => s.id !== id);
  if (filtered.length === schedules.length) return false;
  saveSchedules(filtered);
  return true;
}

/**
 * Get upcoming services (sorted by date/time, future only)
 * Merges admin schedules with fallback mock data
 */
export function getUpcomingServices(fallbackServices: Service[]): Service[] {
  const schedules = getSchedules();
  const now = new Date();

  // Filter to only future schedules
  const futureSchedules = schedules.filter(s => {
    const serviceDate = new Date(`${s.date} ${s.time}`);
    return serviceDate > now;
  });

  // Sort by date ascending
  futureSchedules.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // If we have admin schedules, use them; otherwise use fallback mock data
  if (futureSchedules.length > 0) {
    return futureSchedules;
  }

  return fallbackServices;
}

/**
 * Get the next upcoming service (the one closest to now in the future)
 */
export function getNextService(fallbackServices: Service[]): Service | null {
  const upcoming = getUpcomingServices(fallbackServices);
  return upcoming.length > 0 ? upcoming[0] : null;
}

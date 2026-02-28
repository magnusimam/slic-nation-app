/**
 * Supabase Books Service
 * 
 * CRUD operations for books, replaces localStorage contentManager (book part).
 */

import { createClient } from './client'
import type { BookRow } from './types'
import type { Book } from '../types'

// ────────────────────────────────────────────────
// Type Converters
// ────────────────────────────────────────────────

export function rowToBook(row: BookRow): Book & {
  downloadUrl?: string | null
  isbn?: string | null
  language?: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
} {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    cover: row.cover,
    description: row.description,
    category: row.category,
    pages: row.pages,
    year: row.year,
    downloads: row.downloads,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    downloadUrl: row.download_url,
    isbn: row.isbn,
    language: row.language,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function bookToRow(book: Partial<Book> & {
  downloadUrl?: string | null
  isbn?: string | null
  language?: string | null
}): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (book.title !== undefined) row.title = book.title
  if (book.author !== undefined) row.author = book.author
  if (book.cover !== undefined) row.cover = book.cover
  if (book.description !== undefined) row.description = book.description
  if (book.category !== undefined) row.category = book.category
  if (book.pages !== undefined) row.pages = book.pages
  if (book.year !== undefined) row.year = book.year
  if (book.downloads !== undefined) row.downloads = book.downloads
  if (book.isNew !== undefined) row.is_new = book.isNew
  if (book.isFeatured !== undefined) row.is_featured = book.isFeatured
  if (book.downloadUrl !== undefined) row.download_url = book.downloadUrl
  if (book.isbn !== undefined) row.isbn = book.isbn
  if (book.language !== undefined) row.language = book.language
  return row
}

// ────────────────────────────────────────────────
// CRUD Operations
// ────────────────────────────────────────────────

export async function getBooks() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToBook)
}

export async function getBook(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data ? rowToBook(data) : null
}

export async function getFeaturedBooks() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map(rowToBook)
}

export async function getBooksByCategory(category: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('category', category)
    .order('year', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToBook)
}

export async function addBook(book: Omit<Book, 'id'> & {
  downloadUrl?: string | null
  isbn?: string | null
  language?: string | null
}) {
  const supabase = createClient()
  const row = bookToRow(book)

  const { data, error } = await supabase
    .from('books')
    .insert(row)
    .select()
    .single()

  if (error) throw error
  return data ? rowToBook(data) : null
}

export async function updateBook(id: string, updates: Partial<Book> & {
  downloadUrl?: string | null
  isbn?: string | null
  language?: string | null
}) {
  const supabase = createClient()
  const row = bookToRow(updates)

  console.log('[Supabase] Updating book:', id)
  console.log('[Supabase] Update data:', row)

  // Don't use .single() as it can hang if RLS blocks
  const { data, error } = await supabase
    .from('books')
    .update(row)
    .eq('id', id)
    .select()

  console.log('[Supabase] Update response - data:', data, 'error:', error)

  if (error) {
    console.error('[Supabase] Update error:', error)
    throw error
  }
  
  if (!data || data.length === 0) {
    console.error('[Supabase] Update returned no rows - RLS may be blocking')
    throw new Error('Update failed - no rows returned. Check RLS policies.')
  }
  
  console.log('[Supabase] Update success:', data[0]?.id)
  return data[0] ? rowToBook(data[0]) : null
}

export async function deleteBook(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

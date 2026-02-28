'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ImageUpload';
import {
  Video,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Search,
  Filter,
  Youtube,
  ExternalLink,
  Star,
  StarOff,
  Clock,
  User,
  Calendar,
  Eye,
  Download,
  FileText,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Link2,
  Settings,
  Loader2,
} from 'lucide-react';
import {
  getVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  resetToDefaultContent,
  VIDEO_CATEGORIES,
  BOOK_CATEGORIES,
  type ManagedVideo,
  type ManagedBook,
} from '@/lib/contentManager';
import {
  getVideos as getSupabaseVideos,
  addVideo as addSupabaseVideo,
  updateVideo as updateSupabaseVideo,
  deleteVideo as deleteSupabaseVideo,
} from '@/lib/supabase/videos';
import {
  getBooks as getSupabaseBooks,
  addBook as addSupabaseBook,
  updateBook as updateSupabaseBook,
  deleteBook as deleteSupabaseBook,
} from '@/lib/supabase/books';

type ContentTab = 'videos' | 'books';
type ViewMode = 'grid' | 'list';

export default function ContentManagementPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  // Tab state - ALL hooks must be before any conditional returns
  const [activeTab, setActiveTab] = useState<ContentTab>('videos');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Search/filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Videos state
  const [videos, setVideos] = useState<ManagedVideo[]>([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Video form fields
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoSpeaker, setVideoSpeaker] = useState('Apst Emmanuel Etim');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoYoutubeId, setVideoYoutubeId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCategory, setVideoCategory] = useState('teaching');
  const [videoSeries, setVideoSeries] = useState('');
  const [videoDate, setVideoDate] = useState('');
  const [videoIsFeatured, setVideoIsFeatured] = useState(false);
  
  // Books state
  const [books, setBooks] = useState<ManagedBook[]>([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  
  // Book form fields
  const [bookTitle, setBookTitle] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Apst Emmanuel Etim');
  const [bookCover, setBookCover] = useState('');
  const [bookDownloadUrl, setBookDownloadUrl] = useState('');
  const [bookCategory, setBookCategory] = useState('teaching');
  const [bookPages, setBookPages] = useState(0);
  const [bookYear, setBookYear] = useState(new Date().getFullYear());
  const [bookIsFeatured, setBookIsFeatured] = useState(false);
  
  // Load content on mount - Supabase only
  const loadContent = async () => {
    try {
      const [v, b] = await Promise.all([getSupabaseVideos(), getSupabaseBooks()]);
      setVideos(v as ManagedVideo[]);
      setBooks(b as ManagedBook[]);
      console.log('[Content] Loaded from Supabase:', v.length, 'videos,', b.length, 'books');
    } catch (error) {
      console.error('[Content] Failed to load from Supabase:', error);
      setSaveMessage({ type: 'error', text: `Failed to load content: ${error instanceof Error ? error.message : 'Connection error'}` });
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Admin guard - redirect non-admins
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/');
    }
  }, [user, profile, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!user || profile?.role !== 'admin') {
    return null;
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // VIDEO HANDLERS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const resetVideoForm = () => {
    setVideoTitle('');
    setVideoDescription('');
    setVideoSpeaker('Apst Emmanuel Etim');
    setVideoThumbnail('');
    setVideoYoutubeId('');
    setVideoUrl('');
    setVideoDuration(0);
    setVideoCategory('teaching');
    setVideoSeries('');
    setVideoDate('');
    setVideoIsFeatured(false);
    setEditingVideoId(null);
    setShowVideoForm(false);
  };
  
  const handleAddVideo = async () => {
    if (!videoTitle) return;
    
    console.log('[handleAddVideo] Starting...');
    setSaving(true);
    setSaveMessage(null);
    
    const thumbnail = videoThumbnail || 
      (videoYoutubeId ? `https://img.youtube.com/vi/${videoYoutubeId}/maxresdefault.jpg` : 
      'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop');
    
    const videoData = {
      title: videoTitle,
      description: videoDescription,
      speaker: videoSpeaker,
      thumbnail,
      youtubeId: videoYoutubeId,
      videoUrl,
      duration: videoDuration,
      category: videoCategory,
      series: videoSeries,
      date: videoDate,
      isFeatured: videoIsFeatured,
    };
    
    console.log('[handleAddVideo] Video data:', videoData);
    
    try {
      if (editingVideoId) {
        console.log('[handleAddVideo] Updating video:', editingVideoId);
        await updateSupabaseVideo(editingVideoId, videoData);
        console.log('[handleAddVideo] Update complete!');
        setSaveMessage({ type: 'success', text: 'Video updated successfully!' });
      } else {
        console.log('[handleAddVideo] Adding new video');
        await addSupabaseVideo({ ...videoData, views: 0 });
        console.log('[handleAddVideo] Add complete!');
        setSaveMessage({ type: 'success', text: 'Video added successfully!' });
      }
      console.log('[handleAddVideo] Reloading content...');
      await loadContent();
      console.log('[handleAddVideo] Content reloaded, resetting form...');
      resetVideoForm();
      console.log('[handleAddVideo] Done!');
    } catch (error) {
      console.error('[handleAddVideo] Error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setSaveMessage({ type: 'error', text: `Failed to save: ${errorMessage}` });
    } finally {
      console.log('[handleAddVideo] Finally block - stopping save state');
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };
  
  const handleEditVideo = (video: ManagedVideo) => {
    setEditingVideoId(video.id);
    setVideoTitle(video.title);
    setVideoDescription(video.description || '');
    setVideoSpeaker(video.speaker);
    setVideoThumbnail(video.thumbnail || '');
    setVideoYoutubeId(video.youtubeId || '');
    setVideoUrl(video.videoUrl || '');
    setVideoDuration(video.duration);
    setVideoCategory(video.category);
    setVideoSeries(video.series || '');
    setVideoDate(video.date);
    setVideoIsFeatured(video.isFeatured || false);
    setShowVideoForm(true);
  };
  
  const handleDeleteVideo = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteSupabaseVideo(id);
        await loadContent();
      } catch (error) {
        console.error('[Supabase] Delete error:', error);
        setSaveMessage({ type: 'error', text: `Failed to delete: ${error instanceof Error ? error.message : String(error)}` });
      }
    }
  };
  
  const handleToggleVideoFeatured = async (video: ManagedVideo) => {
    try {
      await updateSupabaseVideo(video.id, { isFeatured: !video.isFeatured });
      await loadContent();
    } catch (error) {
      console.error('[Supabase] Toggle featured error:', error);
      setSaveMessage({ type: 'error', text: `Failed to update: ${error instanceof Error ? error.message : String(error)}` });
    }
  };
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BOOK HANDLERS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const resetBookForm = () => {
    setBookTitle('');
    setBookDescription('');
    setBookAuthor('Apst Emmanuel Etim');
    setBookCover('');
    setBookDownloadUrl('');
    setBookCategory('teaching');
    setBookPages(0);
    setBookYear(new Date().getFullYear());
    setBookIsFeatured(false);
    setEditingBookId(null);
    setShowBookForm(false);
  };
  
  const handleAddBook = async () => {
    if (!bookTitle) return;
    
    setSaving(true);
    setSaveMessage(null);
    
    const cover = bookCover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
    
    const bookData = {
      title: bookTitle,
      description: bookDescription,
      author: bookAuthor,
      cover,
      downloadUrl: bookDownloadUrl,
      category: bookCategory,
      pages: bookPages,
      year: bookYear,
      isFeatured: bookIsFeatured,
    };
    
    try {
      if (editingBookId) {
        console.log('[Supabase] Updating book:', editingBookId);
        await updateSupabaseBook(editingBookId, bookData);
        console.log('[Supabase] Book updated successfully');
        setSaveMessage({ type: 'success', text: 'Book updated successfully!' });
      } else {
        console.log('[Supabase] Adding new book');
        await addSupabaseBook({ ...bookData, downloads: 0 });
        console.log('[Supabase] Book added successfully');
        setSaveMessage({ type: 'success', text: 'Book added successfully!' });
      }
      await loadContent();
      resetBookForm();
    } catch (error) {
      console.error('[Supabase] Error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setSaveMessage({ type: 'error', text: `Failed to save: ${errorMessage}` });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };
  
  const handleEditBook = (book: ManagedBook) => {
    setEditingBookId(book.id);
    setBookTitle(book.title);
    setBookDescription(book.description || '');
    setBookAuthor(book.author);
    setBookCover(book.cover || '');
    setBookDownloadUrl(book.downloadUrl || '');
    setBookCategory(book.category);
    setBookPages(book.pages || 0);
    setBookYear(book.year);
    setBookIsFeatured(book.isFeatured || false);
    setShowBookForm(true);
  };
  
  const handleDeleteBook = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteSupabaseBook(id);
        await loadContent();
      } catch (error) {
        console.error('[Supabase] Delete error:', error);
        setSaveMessage({ type: 'error', text: `Failed to delete: ${error instanceof Error ? error.message : String(error)}` });
      }
    }
  };
  
  const handleToggleBookFeatured = async (book: ManagedBook) => {
    try {
      await updateSupabaseBook(book.id, { isFeatured: !book.isFeatured });
      await loadContent();
    } catch (error) {
      console.error('[Supabase] Toggle featured error:', error);
      setSaveMessage({ type: 'error', text: `Failed to update: ${error instanceof Error ? error.message : String(error)}` });
    }
  };
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FILTERING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || v.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const currentCategories = activeTab === 'videos' ? VIDEO_CATEGORIES : BOOK_CATEGORIES;
  
  // Extract YouTube ID from URL - handles various formats
  const extractYouTubeId = (input: string): string => {
    if (!input) return '';
    const trimmed = input.trim();
    
    // Already an ID (11 characters, alphanumeric with - and _)
    if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
    
    // YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([\w-]{11})/,
      /youtube\.com\/shorts\/([\w-]{11})/,
      /youtube\.com\/live\/([\w-]{11})/,
    ];
    
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) return match[1];
    }
    
    // If no match found, return empty (invalid URL)
    return '';
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 sm:pb-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Content Management</h1>
                <Badge 
                  variant="outline" 
                  className="text-xs border-green-500 text-green-500"
                >
                  ● Supabase
                </Badge>
              </div>
              <p className="text-sm text-foreground/70">
                Manage videos and books stored in cloud database
              </p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
          <button
            onClick={() => { setActiveTab('videos'); setFilterCategory('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'videos' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <Video className="w-4 h-4" />
            Videos
            <Badge variant="secondary" className="ml-1">{videos.length}</Badge>
          </button>
          <button
            onClick={() => { setActiveTab('books'); setFilterCategory('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'books' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Books
            <Badge variant="secondary" className="ml-1">{books.length}</Badge>
          </button>
        </div>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Categories</option>
              {currentCategories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
            <div className="flex border border-border rounded-md">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <Button 
              onClick={() => activeTab === 'videos' ? setShowVideoForm(true) : setShowBookForm(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'videos' ? 'Video' : 'Book'}
            </Button>
          </div>
        </div>
        
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* VIDEOS TAB */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            {/* Video Form */}
            {showVideoForm && (
              <div className="rounded-xl border-2 border-primary/30 bg-card p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    {editingVideoId ? <Edit2 className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                    {editingVideoId ? 'Edit Video' : 'Add New Video'}
                  </h2>
                  <button onClick={resetVideoForm} className="p-2 rounded-lg hover:bg-muted">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      placeholder="Video title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Video description..."
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-500" />
                      YouTube Video ID or URL
                    </label>
                    <Input
                      placeholder="e.g., dQw4w9WgXcQ or full YouTube URL"
                      value={videoYoutubeId}
                      onChange={(e) => setVideoYoutubeId(extractYouTubeId(e.target.value))}
                    />
                    {videoYoutubeId && (
                      <p className="text-xs text-foreground/50">ID: {videoYoutubeId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Or External Video URL</label>
                    <Input
                      placeholder="https://..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Speaker</label>
                    <Input
                      placeholder="Speaker name"
                      value={videoSpeaker}
                      onChange={(e) => setVideoSpeaker(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      placeholder="45"
                      value={videoDuration || ''}
                      onChange={(e) => setVideoDuration(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                    >
                      {VIDEO_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Series (optional)</label>
                    <Input
                      placeholder="e.g., Faith Series"
                      value={videoSeries}
                      onChange={(e) => setVideoSeries(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={videoDate}
                      onChange={(e) => setVideoDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Thumbnail</label>
                    <ImageUpload
                      value={videoThumbnail}
                      onChange={setVideoThumbnail}
                      folder="thumbnails"
                      aspectRatio="video"
                      placeholder="Upload thumbnail (or auto-fetch from YouTube)"
                    />
                    {!videoThumbnail && videoYoutubeId && (
                      <p className="text-xs text-foreground/50">Will use YouTube thumbnail if empty</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={videoIsFeatured}
                        onChange={(e) => setVideoIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Featured on homepage</span>
                    </label>
                  </div>
                </div>
                
                {saveMessage && (
                  <div className={`p-3 rounded-lg text-sm ${saveMessage.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {saveMessage.text}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAddVideo} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? 'Saving...' : (editingVideoId ? 'Update Video' : 'Add Video')}
                  </Button>
                  <Button variant="outline" onClick={resetVideoForm} disabled={saving}>Cancel</Button>
                </div>
              </div>
            )}
            
            {/* Videos List */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 text-foreground/50">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No videos found</p>
                <p className="text-sm mt-1">Add your first video above</p>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-2">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-14 sm:w-32 sm:h-18 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{video.title}</h3>
                        {video.isFeatured && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-foreground/60 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {video.speaker}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}min
                        </span>
                        <Badge variant="outline" className="text-[10px]">{video.category}</Badge>
                        {video.youtubeId && <Youtube className="w-3 h-3 text-red-500" />}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleToggleVideoFeatured(video)}
                        className={`p-2 rounded-lg transition-colors ${video.isFeatured ? 'text-yellow-500 hover:bg-yellow-500/10' : 'text-foreground/50 hover:bg-muted'}`}
                        title={video.isFeatured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {video.isFeatured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-foreground/50 hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-foreground/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      {video.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {video.duration}min
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-foreground text-sm truncate">{video.title}</h3>
                      <p className="text-xs text-foreground/60 truncate">{video.speaker}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-[10px]">{video.category}</Badge>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditVideo(video)}
                            className="p-1 rounded hover:bg-muted"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="p-1 rounded hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* BOOKS TAB */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'books' && (
          <div className="space-y-4">
            {/* Book Form */}
            {showBookForm && (
              <div className="rounded-xl border-2 border-secondary/30 bg-card p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    {editingBookId ? <Edit2 className="w-4 h-4 text-secondary" /> : <Plus className="w-4 h-4 text-secondary" />}
                    {editingBookId ? 'Edit Book' : 'Add New Book'}
                  </h2>
                  <button onClick={resetBookForm} className="p-2 rounded-lg hover:bg-muted">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      placeholder="Book title"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Book description..."
                      value={bookDescription}
                      onChange={(e) => setBookDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Author</label>
                    <Input
                      placeholder="Author name"
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={bookCategory}
                      onChange={(e) => setBookCategory(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                    >
                      {BOOK_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Link2 className="w-4 h-4" />
                      Download/View URL
                    </label>
                    <Input
                      placeholder="Google Drive, Dropbox link, etc."
                      value={bookDownloadUrl}
                      onChange={(e) => setBookDownloadUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Cover Image</label>
                    <ImageUpload
                      value={bookCover}
                      onChange={setBookCover}
                      folder="books"
                      aspectRatio="portrait"
                      placeholder="Upload book cover image"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Pages</label>
                    <Input
                      type="number"
                      placeholder="150"
                      value={bookPages || ''}
                      onChange={(e) => setBookPages(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={bookYear}
                      onChange={(e) => setBookYear(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookIsFeatured}
                        onChange={(e) => setBookIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Featured on homepage</span>
                    </label>
                  </div>
                </div>
                
                {saveMessage && (
                  <div className={`p-3 rounded-lg text-sm ${saveMessage.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {saveMessage.text}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAddBook} disabled={saving} className="gap-2 bg-secondary hover:bg-secondary/90">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? 'Saving...' : (editingBookId ? 'Update Book' : 'Add Book')}
                  </Button>
                  <Button variant="outline" onClick={resetBookForm} disabled={saving}>Cancel</Button>
                </div>
              </div>
            )}
            
            {/* Books List */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12 text-foreground/50">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No books found</p>
                <p className="text-sm mt-1">Add your first book above</p>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-2">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    {/* Cover */}
                    <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{book.title}</h3>
                        {book.isFeatured && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-foreground/60 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {book.author}
                        </span>
                        {book.pages > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {book.pages} pages
                          </span>
                        )}
                        <span>{book.year}</span>
                        <Badge variant="outline" className="text-[10px]">{book.category}</Badge>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {book.downloadUrl && (
                        <a
                          href={book.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-muted text-foreground/50 hover:text-foreground transition-colors"
                          title="Open book link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleToggleBookFeatured(book)}
                        className={`p-2 rounded-lg transition-colors ${book.isFeatured ? 'text-yellow-500 hover:bg-yellow-500/10' : 'text-foreground/50 hover:bg-muted'}`}
                        title={book.isFeatured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {book.isFeatured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditBook(book)}
                        className="p-2 rounded-lg hover:bg-secondary/10 text-foreground/50 hover:text-secondary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-foreground/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="group rounded-lg border border-border bg-card overflow-hidden hover:border-secondary/50 transition-colors"
                  >
                    <div className="relative aspect-[2/3] bg-muted">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {book.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-foreground text-xs truncate">{book.title}</h3>
                      <p className="text-[10px] text-foreground/60 truncate">{book.author}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-[8px]">{book.category}</Badge>
                        <div className="flex gap-0.5">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="p-1 rounded hover:bg-muted"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-1 rounded hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Info Note */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border space-y-3">
          <p className="text-sm text-foreground/70">
            <strong>Note:</strong> Content is managed via Supabase. For videos, paste YouTube URLs or video IDs. 
            For books, use external links (Google Drive, Dropbox) for the download URL. 
            The frontend will display content added here.
          </p>
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (confirm('This will reset all videos and books to the original placeholders. Are you sure?')) {
                  resetToDefaultContent();
                  await loadContent();
                }
              }}
              className="text-foreground/70"
            >
              Reset to Default Content
            </Button>
            <span className="text-xs text-foreground/50">Restores original placeholder content</span>
          </div>
        </div>
      </main>
      
      <MobileNavBar />
    </div>
  );
}

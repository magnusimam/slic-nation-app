'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LIVE_SERVICES } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Play,
  Pause,
  Calendar,
  Clock,
  Users,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Share2,
  Bell,
  BellRing,
  Heart,
  Copy,
  Check,
  X,
  PictureInPicture,
  Hand,
  Send,
  Facebook,
  Twitter,
  MessageCircle,
  Link2,
  Gift,
  CalendarPlus,
  PlayCircle,
  Eye,
  FileText,
  Captions,
  Radio,
  Keyboard,
  ChevronDown,
  ChevronUp,
  Headphones,
  MoreVertical,
  Gauge,
} from 'lucide-react';

// Mock chat messages
const MOCK_CHAT_MESSAGES = [
  { id: 1, user: 'Grace M.', message: 'Good morning everyone! 🙏', time: '9:01 AM', isNew: false },
  { id: 2, user: 'David O.', message: 'Blessed to be here today', time: '9:02 AM', isNew: false },
  { id: 3, user: 'Sarah K.', message: 'Hallelujah! Expecting a word from the Lord', time: '9:03 AM', isNew: false },
  { id: 4, user: 'Pastor Emmanuel', message: 'Welcome beloved, prepare your hearts! 🔥', time: '9:04 AM', isNew: false, isHost: true },
  { id: 5, user: 'Faith A.', message: 'Amen! 🙌', time: '9:05 AM', isNew: false },
];

const INCOMING_MESSAGES = [
  { user: 'John B.', message: 'This message is powerful!' },
  { user: 'Mary N.', message: 'Amen Pastor! 🙏' },
  { user: 'Peter O.', message: 'Glory to God!' },
  { user: 'Ruth E.', message: 'Thank you Jesus! ❤️' },
  { user: 'Samuel K.', message: 'Word on fire today 🔥' },
  { user: 'Esther M.', message: 'I receive this in Jesus name!' },
  { user: 'Daniel A.', message: 'Hallelujah!' },
  { user: 'Mercy J.', message: 'This is exactly what I needed to hear' },
];

// Sermon notes mock data
const SERMON_OUTLINE = [
  { id: 1, title: 'Introduction', time: '0:00', content: 'Welcome and opening prayer' },
  { id: 2, title: 'The Call to Purpose', time: '15:30', content: 'Understanding God\'s unique design for your life - Jeremiah 29:11' },
  { id: 3, title: 'Overcoming Obstacles', time: '35:00', content: 'Breaking through barriers that hinder your destiny' },
  { id: 4, title: 'Walking in Faith', time: '52:00', content: 'Practical steps to activate your purpose daily' },
  { id: 5, title: 'Prayer & Declaration', time: '1:15:00', content: 'Corporate prayer and prophetic declarations' },
  { id: 6, title: 'Closing & Benediction', time: '1:35:00', content: 'Final words and blessing' },
];

// Recent replays mock data
const RECENT_REPLAYS = [
  { id: 'r1', title: 'Walking in Divine Purpose', date: '2026-02-15', views: 3420, duration: '1:45:00', thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=225&fit=crop' },
  { id: 'r2', title: 'The Power of Consistent Prayer', date: '2026-02-08', views: 5210, duration: '1:32:00', thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop' },
  { id: 'r3', title: 'Faith That Moves Mountains', date: '2026-02-01', views: 4890, duration: '1:28:00', thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=225&fit=crop' },
];

export default function LivePage() {
  const currentService = LIVE_SERVICES[0];
  const upcomingServices = LIVE_SERVICES.slice(1);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Countdown state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Prayer request state
  const [prayerOpen, setPrayerOpen] = useState(false);
  const [prayerName, setPrayerName] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);
  
  // Reminder state
  const [reminderSet, setReminderSet] = useState(false);
  
  // Share state
  const [shareOpen, setShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Live reactions
  const [reactions, setReactions] = useState<{id: number; emoji: string; x: number}[]>([]);

  // Priority 3 states
  const [showNotes, setShowNotes] = useState(true);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [viewerCount, setViewerCount] = useState(12450);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [showMobileReactions, setShowMobileReactions] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Simulate incoming chat messages
  useEffect(() => {
    if (!currentService.isLive && countdown.days === 0 && countdown.hours === 0) return;
    
    const interval = setInterval(() => {
      if (messageIndex < INCOMING_MESSAGES.length) {
        const newMessage = {
          id: Date.now(),
          user: INCOMING_MESSAGES[messageIndex].user,
          message: INCOMING_MESSAGES[messageIndex].message,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          isNew: true,
        };
        setChatMessages(prev => [...prev.slice(-20), newMessage]);
        setMessageIndex(prev => prev + 1);
      }
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [messageIndex, currentService.isLive, countdown]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      user: 'You',
      message: chatInput,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isNew: true,
      isMe: true,
    };
    setChatMessages(prev => [...prev.slice(-20), newMessage]);
    setChatInput('');
  };

  // Calendar functions
  const addToGoogleCalendar = () => {
    const startDate = new Date(currentService.date + ' ' + currentService.time);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(currentService.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent('Join us for ' + currentService.title + ' with ' + currentService.speaker)}&location=${encodeURIComponent('SLIC Nations Live Stream')}`;
    
    window.open(googleUrl, '_blank');
  };

  const addToAppleCalendar = () => {
    const startDate = new Date(currentService.date + ' ' + currentService.time);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
SUMMARY:${currentService.title}
DESCRIPTION:Join us for ${currentService.title} with ${currentService.speaker}
LOCATION:SLIC Nations Live Stream
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slic-nations-service.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          setIsMuted(prev => !prev);
          break;
        case 'c':
          e.preventDefault();
          setCaptionsEnabled(prev => !prev);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(prev => Math.min(100, prev + 10));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 10));
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardShortcuts(prev => !prev);
          break;
        case 'escape':
          setShowKeyboardShortcuts(false);
          setShowQualityMenu(false);
          setShowSpeedMenu(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate fluctuating viewer count when live
  useEffect(() => {
    if (!currentService.isLive) return;
    
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 50) - 20; // -20 to +30
        return Math.max(10000, prev + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentService.isLive]);

  // Countdown timer effect
  useEffect(() => {
    if (currentService.isLive) return;
    
    const serviceDate = new Date(currentService.date + ' ' + currentService.time);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = serviceDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentService]);

  // Hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const player = playerRef.current;
    player?.addEventListener('mousemove', handleMouseMove);
    return () => {
      player?.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    // PiP would work with actual video element
    console.log('Picture-in-Picture requested');
  };

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Prayer request:', { name: prayerName, request: prayerRequest });
    setPrayerSubmitted(true);
    setTimeout(() => {
      setPrayerOpen(false);
      setPrayerSubmitted(false);
      setPrayerName('');
      setPrayerRequest('');
    }, 2000);
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    // In production, this would trigger push notification registration
    console.log('Reminder set for:', currentService.title);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Join me for ${currentService.title} at SLIC Nations!`);
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const addReaction = (emoji: string) => {
    const id = Date.now();
    const x = Math.random() * 80 + 10; // Random position 10-90%
    setReactions(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        {/* Page Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Live Services</h1>
            <p className="text-sm md:text-base text-foreground/70">
              Join us for live worship and teachings
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Set Reminder */}
            <Button
              variant={reminderSet ? "default" : "outline"}
              size="sm"
              className={`gap-2 ${reminderSet ? 'bg-primary' : ''}`}
              onClick={handleSetReminder}
            >
              {reminderSet ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              <span className="hidden sm:inline">{reminderSet ? 'Reminder Set' : 'Remind Me'}</span>
            </Button>
            
            {/* Share */}
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share this service</DialogTitle>
                  <DialogDescription>
                    Invite friends and family to join the service
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {/* Social Share Buttons */}
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={() => shareToSocial('facebook')}
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={() => shareToSocial('twitter')}
                    >
                      <Twitter className="w-5 h-5 text-sky-500" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={() => shareToSocial('whatsapp')}
                    >
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      WhatsApp
                    </Button>
                  </div>
                  
                  {/* Copy Link */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                      <Link2 className="w-4 h-4 text-foreground/50 flex-shrink-0" />
                      <span className="text-sm text-foreground/70 truncate">
                        {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
                      </span>
                    </div>
                    <Button onClick={copyLink} variant="default" size="sm" className="gap-2">
                      {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {linkCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Prayer Request */}
            <Dialog open={prayerOpen} onOpenChange={setPrayerOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="gap-2 bg-primary">
                  <Hand className="w-4 h-4" />
                  <span className="hidden sm:inline">Prayer Request</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Hand className="w-5 h-5 text-primary" />
                    Submit Prayer Request
                  </DialogTitle>
                  <DialogDescription>
                    Share your prayer needs with our ministry team
                  </DialogDescription>
                </DialogHeader>
                
                {prayerSubmitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">Prayer Request Received</p>
                    <p className="text-sm text-foreground/70">We are lifting you up in prayer</p>
                  </div>
                ) : (
                  <form onSubmit={handlePrayerSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Your Name (optional)</label>
                      <Input
                        placeholder="Enter your name"
                        value={prayerName}
                        onChange={(e) => setPrayerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Prayer Request *</label>
                      <Textarea
                        placeholder="Share your prayer request..."
                        value={prayerRequest}
                        onChange={(e) => setPrayerRequest(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      <Send className="w-4 h-4" />
                      Submit Prayer Request
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player with Controls */}
            <div 
              ref={playerRef}
              className="relative rounded-xl overflow-hidden bg-black aspect-video group"
              onMouseEnter={() => setShowControls(true)}
            >
              {/* Video/Thumbnail */}
              <div
                className="w-full h-full cursor-pointer"
                style={{
                  backgroundImage: audioOnlyMode ? 'none' : `url('${currentService.thumbnail}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: audioOnlyMode ? '#0a0a0a' : undefined,
                }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {/* Audio Only Mode Overlay */}
                {audioOnlyMode && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-primary/20 flex items-center justify-center mb-3 sm:mb-4">
                        <Headphones className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                      </div>
                      {isPlaying && (
                        <div className="absolute inset-0 w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-primary animate-ping opacity-30" />
                      )}
                    </div>
                    <p className="text-white/70 text-xs sm:text-sm">Audio Only Mode</p>
                    <p className="text-white/50 text-[10px] sm:text-xs mt-1">Lower bandwidth, audio focused</p>
                  </div>
                )}

                {/* Overlay when paused */}
                {!isPlaying && !audioOnlyMode && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center shadow-2xl"
                    >
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-0.5 sm:ml-1" />
                    </Button>
                  </div>
                )}

                {/* Floating Reactions */}
                {reactions.map((reaction) => (
                  <div
                    key={reaction.id}
                    className="absolute bottom-16 sm:bottom-20 text-2xl sm:text-3xl animate-float-up pointer-events-none"
                    style={{ left: `${reaction.x}%` }}
                  >
                    {reaction.emoji}
                  </div>
                ))}

                {/* Live Badge */}
                {currentService.isLive && (
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
                    <span className="font-bold text-xs sm:text-sm">LIVE</span>
                  </div>
                )}

                {/* Countdown Timer (when not live) */}
                {!currentService.isLive && (
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/80 backdrop-blur-sm text-white px-2 sm:px-4 py-2 sm:py-3 rounded-lg max-w-[calc(100%-1rem)] sm:max-w-none">
                    <p className="text-[10px] sm:text-xs text-white/70 mb-1 sm:mb-2">Service starts in</p>
                    {countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0 ? (
                      <div className="flex items-center gap-1 sm:gap-2 font-mono text-sm sm:text-xl font-bold">
                        {countdown.days > 0 && (
                          <>
                            <div className="text-center">
                              <span className="bg-primary/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded block text-xs sm:text-base">{String(countdown.days).padStart(2, '0')}</span>
                              <span className="text-[8px] sm:text-[10px] text-white/50 block mt-0.5">DAYS</span>
                            </div>
                            <span className="text-white/50 text-xs sm:text-base">:</span>
                          </>
                        )}
                        <div className="text-center">
                          <span className="bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded block text-xs sm:text-base">{String(countdown.hours).padStart(2, '0')}</span>
                          <span className="text-[8px] sm:text-[10px] text-white/50 block mt-0.5">HRS</span>
                        </div>
                        <span className="text-white/50 text-xs sm:text-base">:</span>
                        <div className="text-center">
                          <span className="bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded block text-xs sm:text-base">{String(countdown.minutes).padStart(2, '0')}</span>
                          <span className="text-[8px] sm:text-[10px] text-white/50 block mt-0.5">MIN</span>
                        </div>
                        <span className="text-white/50 text-xs sm:text-base">:</span>
                        <div className="text-center">
                          <span className="bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded block text-xs sm:text-base">{String(countdown.seconds).padStart(2, '0')}</span>
                          <span className="text-[8px] sm:text-[10px] text-white/50 block mt-0.5">SEC</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-base sm:text-lg font-bold text-primary">Starting Soon!</p>
                    )}
                  </div>
                )}

                {/* Viewer Count */}
                {currentService.isLive && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">{viewerCount.toLocaleString()}</span>
                  </div>
                )}

                {/* Closed Captions Display */}
                {captionsEnabled && isPlaying && (
                  <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg max-w-[90%] sm:max-w-[80%] text-center">
                    <p className="text-xs sm:text-sm md:text-base">
                      &quot;For I know the plans I have for you, declares the LORD...&quot;
                    </p>
                  </div>
                )}

                {/* Video Controls Bar */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 sm:p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-white/30 rounded-full mb-2 sm:mb-3 cursor-pointer group/progress">
                    <div className="h-full bg-primary rounded-full w-[35%] relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    {/* Left Controls */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
                      </Button>
                      
                      {/* Volume Control */}
                      <div className="flex items-center gap-1 sm:gap-2 group/volume">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            setVolume(Number(e.target.value));
                            setIsMuted(false);
                          }}
                          className="w-0 group-hover/volume:w-16 sm:group-hover/volume:w-20 transition-all duration-200 accent-primary cursor-pointer"
                        />
                      </div>
                      
                      <span className="text-white/70 text-xs sm:text-sm hidden sm:inline">1:23:45 / 2:30:00</span>
                    </div>

                    {/* Mobile Reactions Toggle */}
                    {currentService.isLive && (
                      <div className="sm:hidden relative">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20 w-8 h-8"
                          onClick={() => setShowMobileReactions(!showMobileReactions)}
                        >
                          <span className="text-lg">🙏</span>
                        </Button>
                        {showMobileReactions && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/95 rounded-full px-2 py-1 flex gap-1">
                            {['❤️', '🙏', '🔥', '✝️', '🙌'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  addReaction(emoji);
                                  setShowMobileReactions(false);
                                }}
                                className="text-xl hover:scale-125 transition-transform p-1"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Desktop Reaction Buttons */}
                    {currentService.isLive && (
                      <div className="hidden sm:flex items-center gap-1">
                        {['❤️', '🙏', '🔥', '✝️', '🙌'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(emoji)}
                            className="text-xl hover:scale-125 transition-transform p-1"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Right Controls */}
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {/* Mobile Settings Button */}
                      <Sheet open={mobileSettingsOpen} onOpenChange={setMobileSettingsOpen}>
                        <SheetTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-white/20 w-8 h-8 sm:hidden"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="bg-background/95 backdrop-blur-lg border-t border-border max-h-[70vh]">
                          <SheetHeader className="text-left pb-4 border-b border-border">
                            <SheetTitle>Player Settings</SheetTitle>
                          </SheetHeader>
                          <div className="py-4 space-y-4">
                            {/* Playback Speed */}
                            <div>
                              <p className="text-xs text-foreground/70 mb-2 flex items-center gap-2">
                                <Gauge className="w-4 h-4" /> Playback Speed
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                  <Button
                                    key={speed}
                                    size="sm"
                                    variant={playbackSpeed === speed ? "default" : "outline"}
                                    onClick={() => setPlaybackSpeed(speed)}
                                    className="flex-1 min-w-[60px]"
                                  >
                                    {speed}x
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Quality */}
                            <div>
                              <p className="text-xs text-foreground/70 mb-2 flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Video Quality
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {['Auto', '1080p', '720p', '480p', '360p'].map((q) => (
                                  <Button
                                    key={q}
                                    size="sm"
                                    variant={quality === q ? "default" : "outline"}
                                    onClick={() => setQuality(q)}
                                    className="flex-1 min-w-[60px]"
                                  >
                                    {q}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Toggle Options */}
                            <div className="space-y-2">
                              <button
                                onClick={() => setCaptionsEnabled(!captionsEnabled)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                  captionsEnabled ? 'bg-primary/10 border-primary/30' : 'border-border hover:bg-muted'
                                }`}
                              >
                                <span className="flex items-center gap-3">
                                  <Captions className="w-5 h-5" />
                                  <span className="text-sm">Closed Captions</span>
                                </span>
                                <span className={`text-xs ${captionsEnabled ? 'text-primary' : 'text-foreground/50'}`}>
                                  {captionsEnabled ? 'ON' : 'OFF'}
                                </span>
                              </button>

                              <button
                                onClick={() => setAudioOnlyMode(!audioOnlyMode)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                  audioOnlyMode ? 'bg-primary/10 border-primary/30' : 'border-border hover:bg-muted'
                                }`}
                              >
                                <span className="flex items-center gap-3">
                                  <Headphones className="w-5 h-5" />
                                  <span className="text-sm">Audio Only Mode</span>
                                </span>
                                <span className={`text-xs ${audioOnlyMode ? 'text-primary' : 'text-foreground/50'}`}>
                                  {audioOnlyMode ? 'ON' : 'OFF'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>

                      {/* Desktop Playback Speed */}
                      <div className="relative hidden sm:block">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20 h-10 px-2 text-xs font-medium"
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        >
                          {playbackSpeed}x
                        </Button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-2 min-w-[100px]">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => {
                                  setPlaybackSpeed(speed);
                                  setShowSpeedMenu(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 ${playbackSpeed === speed ? 'text-primary' : 'text-white'}`}
                              >
                                {speed}x {playbackSpeed === speed && '✓'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Desktop Closed Captions */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`w-10 h-10 hidden sm:flex ${captionsEnabled ? 'text-primary bg-primary/20' : 'text-white hover:bg-white/20'}`}
                        onClick={() => setCaptionsEnabled(!captionsEnabled)}
                        title="Toggle Captions (C)"
                      >
                        <Captions className="w-5 h-5" />
                      </Button>

                      {/* Desktop Audio Only Mode */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`w-10 h-10 hidden sm:flex ${audioOnlyMode ? 'text-primary bg-primary/20' : 'text-white hover:bg-white/20'}`}
                        onClick={() => setAudioOnlyMode(!audioOnlyMode)}
                        title="Audio Only Mode"
                      >
                        <Headphones className="w-5 h-5" />
                      </Button>

                      {/* Quality Selector - Desktop only */}
                      <div className="relative hidden sm:block">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20 w-10 h-10"
                          onClick={() => setShowQualityMenu(!showQualityMenu)}
                        >
                          <Settings className="w-5 h-5" />
                        </Button>
                        {showQualityMenu && (
                          <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-2 min-w-[140px]">
                            <div className="px-3 py-1 text-xs text-white/50 border-b border-white/10 mb-1">Quality</div>
                            {[
                              { label: '1080p', badge: 'HD' },
                              { label: '720p', badge: 'HD' },
                              { label: '480p', badge: '' },
                              { label: '360p', badge: '' },
                              { label: 'Auto', badge: '' },
                            ].map((q) => (
                              <button
                                key={q.label}
                                onClick={() => {
                                  setQuality(q.label);
                                  setShowQualityMenu(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 flex items-center justify-between ${quality === q.label ? 'text-primary' : 'text-white'}`}
                              >
                                <span>{q.label}</span>
                                <span className="flex items-center gap-1">
                                  {q.badge && <span className="text-[10px] bg-primary/30 text-primary px-1 rounded">{q.badge}</span>}
                                  {quality === q.label && '✓'}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20 w-10 h-10 hidden sm:flex"
                        onClick={togglePiP}
                      >
                        <PictureInPicture className="w-5 h-5" />
                      </Button>

                      {/* Desktop Keyboard Shortcuts */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20 w-10 h-10 hidden sm:flex"
                        onClick={() => setShowKeyboardShortcuts(true)}
                        title="Keyboard Shortcuts (?)"
                      >
                        <Keyboard className="w-5 h-5" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
                        onClick={toggleFullscreen}
                      >
                        {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 md:mb-2">
                    {currentService.title}
                  </h2>
                  <p className="text-sm md:text-base text-foreground/70">Led by {currentService.speaker}</p>
                </div>
                {currentService.isLive && (
                  <Badge className="bg-red-600 hover:bg-red-600 flex-shrink-0 text-xs">
                    LIVE
                  </Badge>
                )}
              </div>

              {/* Service Info */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-foreground/70">Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(currentService.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-foreground/70">Time</p>
                    <p className="text-sm font-semibold text-foreground">{currentService.time}</p>
                  </div>
                </div>
              </div>

              {/* Sermon Notes/Outline */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <button 
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm md:text-base">Sermon Outline</h3>
                    <Badge variant="secondary" className="text-xs">{SERMON_OUTLINE.length} points</Badge>
                  </div>
                  {showNotes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {showNotes && (
                  <div className="px-4 pb-4 md:px-6 md:pb-6 space-y-2">
                    {SERMON_OUTLINE.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setExpandedNoteId(expandedNoteId === item.id ? null : item.id)}
                        className="w-full text-left"
                      >
                        <div className={`p-3 rounded-lg border transition-colors ${expandedNoteId === item.id ? 'bg-primary/10 border-primary/30' : 'bg-muted/50 border-transparent hover:bg-muted'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                                {item.id}
                              </span>
                              <span className="text-sm font-medium text-foreground">{item.title}</span>
                            </div>
                            <span className="text-xs text-foreground/50 font-mono">{item.time}</span>
                          </div>
                          {expandedNoteId === item.id && (
                            <p className="mt-2 ml-9 text-sm text-foreground/70 animate-fade-in">
                              {item.content}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat/Comments Section */}
              <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">Live Chat</h3>
                  <Badge variant="outline" className="text-xs">
                    {chatMessages.length} messages
                  </Badge>
                </div>
                <div 
                  ref={chatContainerRef}
                  className="space-y-3 mb-4 h-48 md:h-64 overflow-y-auto border border-border rounded-lg p-3 md:p-4 scroll-smooth"
                >
                  {chatMessages.map((msg: any) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-2 ${msg.isNew ? 'animate-fade-in' : ''} ${msg.isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        msg.isHost 
                          ? 'bg-primary text-primary-foreground' 
                          : msg.isMe 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-muted text-foreground'
                      }`}>
                        {msg.user.charAt(0)}
                      </div>
                      <div className={`flex-1 ${msg.isMe ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold ${msg.isMe ? 'text-green-500' : msg.isHost ? 'text-primary' : 'text-foreground'}`}>
                            {msg.user}
                          </span>
                          {msg.isHost && (
                            <Badge className="text-[10px] h-4 bg-primary/20 text-primary border-0">HOST</Badge>
                          )}
                          <span className="text-[10px] text-foreground/50">{msg.time}</span>
                        </div>
                        <p className={`text-sm text-foreground/90 mt-0.5 ${msg.isMe ? 'bg-green-500/10 inline-block px-2 py-1 rounded-lg' : ''}`}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-foreground/50 outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Send
                  </Button>
                </form>
              </div>

              {/* Calendar Sync */}
              <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3 text-sm md:text-base flex items-center gap-2">
                  <CalendarPlus className="w-4 h-4" />
                  Add to Calendar
                </h3>
                <p className="text-xs text-foreground/70 mb-3">
                  Never miss a service! Add to your calendar to get reminders.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addToGoogleCalendar}
                    className="text-xs"
                  >
                    <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.5 22h-15A2.5 2.5 0 012 19.5v-15A2.5 2.5 0 014.5 2H8v2H4.5a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h15a.5.5 0 00.5-.5V8h2v11.5a2.5 2.5 0 01-2.5 2.5z"/>
                      <path d="M15 2h7v7h-2V4.414l-7.293 7.293-1.414-1.414L18.586 3H15V2z"/>
                    </svg>
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addToAppleCalendar}
                    className="text-xs"
                  >
                    <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </Button>
                </div>
              </div>

              {/* Give/Offering Button */}
              <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-lg p-4 md:p-6 border border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">Support the Ministry</h3>
                    <p className="text-xs text-foreground/70">Your giving makes a difference</p>
                  </div>
                </div>
                <p className="text-xs text-foreground/70 mb-4">
                  Partner with us to spread the gospel and impact lives across nations.
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 gap-2" 
                  onClick={() => window.location.href = '/donate'}
                >
                  <Gift className="w-4 h-4" />
                  Give Now
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Upcoming Services */}
            <div className="bg-card rounded-lg p-4 md:p-6 border border-border space-y-3 md:space-y-4">
              <h3 className="font-semibold text-foreground text-base md:text-lg">Upcoming Services</h3>
              <div className="space-y-3">
                {upcomingServices.map((service) => (
                  <button
                    key={service.id}
                    className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors group"
                  >
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {service.title}
                    </p>
                    <p className="text-xs text-foreground/70 mt-1">
                      {new Date(service.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at {service.time}
                    </p>
                    <p className="text-xs text-foreground/70 mt-1">{service.speaker}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Replays */}
            <div className="bg-card rounded-lg p-4 md:p-6 border border-border space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-base md:text-lg flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-primary" />
                  Recent Replays
                </h3>
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                  View All
                </Button>
              </div>
              <div className="space-y-2">
                {RECENT_REPLAYS.map((replay) => (
                  <button
                    key={replay.id}
                    className="w-full group"
                  >
                    <div className="flex gap-2 sm:gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="relative w-20 sm:w-24 h-12 sm:h-14 rounded-md overflow-hidden shrink-0 bg-muted">
                        <img 
                          src={replay.thumbnail} 
                          alt={replay.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[8px] sm:text-[10px] bg-black/70 text-white px-1 rounded">
                          {replay.duration}
                        </span>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {replay.title}
                        </p>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                          <span className="text-[10px] sm:text-xs text-foreground/60">
                            {new Date(replay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-foreground/30">•</span>
                          <span className="text-[10px] sm:text-xs text-foreground/60 flex items-center gap-0.5 sm:gap-1">
                            <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {replay.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-4 sm:p-6 border border-primary/30 space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Pro Tips</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Join 5 minutes early for worship</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Prepare your heart for worship</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Visit our library later to rewatch</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Share your blessings on social media</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Keyboard Shortcuts Modal */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Use these shortcuts to control the video player
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-4">
            {[
              { key: 'Space / K', action: 'Play / Pause' },
              { key: 'F', action: 'Toggle Fullscreen' },
              { key: 'M', action: 'Toggle Mute' },
              { key: 'C', action: 'Toggle Captions' },
              { key: '↑', action: 'Increase Volume' },
              { key: '↓', action: 'Decrease Volume' },
              { key: '?', action: 'Show Shortcuts' },
              { key: 'Esc', action: 'Close Menus' },
            ].map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-foreground/70">{shortcut.action}</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono text-foreground">{shortcut.key}</kbd>
              </div>
            ))}
          </div>
          <Button className="mt-4" onClick={() => setShowKeyboardShortcuts(false)}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

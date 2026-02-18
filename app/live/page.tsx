'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LIVE_SERVICES } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LiveStreamPlayer } from '@/components/LiveStreamPlayer';
import { streamConfig } from '@/lib/streamConfig';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Share2,
  Bell,
  BellRing,
  Copy,
  Check,
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
  Radio,
  Keyboard,
  ChevronDown,
  ChevronUp,
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



  // UI states
  const [showNotes, setShowNotes] = useState(true);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case '?':
          e.preventDefault();
          setShowKeyboardShortcuts(prev => !prev);
          break;
        case 'escape':
          setShowKeyboardShortcuts(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            {/* Live Stream Player */}
            <LiveStreamPlayer
              config={streamConfig}
              serviceThumbnail={currentService.thumbnail}
            />

            {/* Countdown Timer (when not live) */}
            {!streamConfig.isLive && (
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black p-6 sm:p-8">
                <div className="text-center space-y-4">
                  <Badge variant="outline" className="text-white/70 border-white/30">
                    <Radio className="w-3 h-3 mr-1.5" />
                    Next Service
                  </Badge>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{currentService.title}</h3>
                  <p className="text-sm text-white/60">Led by {currentService.speaker}</p>
                  
                  {/* Countdown */}
                  {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0) ? (
                    <div className="flex items-center justify-center gap-2 sm:gap-4 font-mono pt-2">
                      {countdown.days > 0 && (
                        <>
                          <div className="text-center">
                            <span className="block text-2xl sm:text-3xl font-bold text-primary">{String(countdown.days).padStart(2, '0')}</span>
                            <span className="text-[10px] sm:text-xs text-white/50">DAYS</span>
                          </div>
                          <span className="text-white/30 text-xl">:</span>
                        </>
                      )}
                      <div className="text-center">
                        <span className="block text-2xl sm:text-3xl font-bold text-white">{String(countdown.hours).padStart(2, '0')}</span>
                        <span className="text-[10px] sm:text-xs text-white/50">HRS</span>
                      </div>
                      <span className="text-white/30 text-xl">:</span>
                      <div className="text-center">
                        <span className="block text-2xl sm:text-3xl font-bold text-white">{String(countdown.minutes).padStart(2, '0')}</span>
                        <span className="text-[10px] sm:text-xs text-white/50">MIN</span>
                      </div>
                      <span className="text-white/30 text-xl">:</span>
                      <div className="text-center">
                        <span className="block text-2xl sm:text-3xl font-bold text-white">{String(countdown.seconds).padStart(2, '0')}</span>
                        <span className="text-[10px] sm:text-xs text-white/50">SEC</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-primary animate-pulse">Starting Soon!</p>
                  )}
                </div>
              </div>
            )}

            {/* Service Details */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 md:mb-2">
                    {currentService.title}
                  </h2>
                  <p className="text-sm md:text-base text-foreground/70">Led by {currentService.speaker}</p>
                </div>
                {streamConfig.isLive && (
                  <Badge className="bg-red-600 hover:bg-red-600 flex-shrink-0 text-xs animate-pulse">
                    <Radio className="w-3 h-3 mr-1" />
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
              Helpful keyboard shortcuts for the live page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-4">
            {[
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

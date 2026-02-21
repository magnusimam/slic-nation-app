'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Radio,
  Youtube,
  Facebook,
  Check,
  Settings,
  Monitor,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  Info,
  CalendarPlus,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  Star,
  Plus,
  X,
  Save,
  Users,
  MessageSquare,
  ShieldCheck,
  Timer,
  Ban,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
} from 'lucide-react';
import { StreamPlatform, ChatSource, ChatApprovalMode, ChatConfig } from '@/lib/types';
import { extractYouTubeId, defaultChatConfig } from '@/lib/streamConfig';
import {
  getStreamConfig,
  saveStreamConfig,
} from '@/lib/streamConfigManager';
import {
  getSchedules,
  addSchedule,
  deleteSchedule,
  updateSchedule,
  type ScheduledService,
} from '@/lib/scheduleManager';

export default function StreamSettingsPage() {
  const [platform, setPlatform] = useState<StreamPlatform>('youtube');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [youtubeChannelId, setYoutubeChannelId] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [showOBSGuide, setShowOBSGuide] = useState(false);
  const [saved, setSaved] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Chat configuration state
  const [chatEnabled, setChatEnabled] = useState(true);
  const [chatSource, setChatSource] = useState<ChatSource>('both');
  const [chatApprovalMode, setChatApprovalMode] = useState<ChatApprovalMode>('auto');
  const [showViewerCount, setShowViewerCount] = useState(true);
  const [allowGuestComments, setAllowGuestComments] = useState(false);
  const [slowModeSeconds, setSlowModeSeconds] = useState(0);
  const [maxMessageLength, setMaxMessageLength] = useState(500);
  const [blockedWordsInput, setBlockedWordsInput] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showChatSettings, setShowChatSettings] = useState(true);

  // Schedule state
  const [schedules, setSchedules] = useState<ScheduledService[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formSpeaker, setFormSpeaker] = useState('Apst Emmanuel Etim');
  const [formDescription, setFormDescription] = useState('');
  const [formIsSpecial, setFormIsSpecial] = useState(false);
  const [formThumbnail, setFormThumbnail] = useState('');

  // Load saved stream config + schedules from localStorage on mount
  useEffect(() => {
    const savedConfig = getStreamConfig();
    setPlatform(savedConfig.platform);
    setIsLive(savedConfig.isLive);
    setYoutubeChannelId(savedConfig.youtubeLiveChannelId || '');
    setFacebookUrl(savedConfig.facebookVideoUrl || '');
    // Pre-fill the video ID input if saved
    if (savedConfig.youtubeVideoId) {
      setYoutubeInput(savedConfig.youtubeVideoId);
    }
    
    // Load chat settings
    const chat = savedConfig.chat || defaultChatConfig;
    setChatEnabled(chat.enabled);
    setChatSource(chat.source);
    setChatApprovalMode(chat.approvalMode);
    setShowViewerCount(chat.showViewerCount);
    setAllowGuestComments(chat.allowGuestComments);
    setSlowModeSeconds(chat.slowModeSeconds);
    setMaxMessageLength(chat.maxMessageLength);
    setBlockedWordsInput(chat.blockedWords?.join(', ') || '');
    setWelcomeMessage(chat.welcomeMessage || '');
    
    setConfigLoaded(true);
    setSchedules(getSchedules());
  }, []);

  const resetForm = () => {
    setFormTitle('');
    setFormDate('');
    setFormTime('');
    setFormSpeaker('Apst Emmanuel Etim');
    setFormDescription('');
    setFormIsSpecial(false);
    setFormThumbnail('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAddSchedule = () => {
    if (!formTitle || !formDate || !formTime) return;
    
    const thumbnail = formThumbnail || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop';
    
    if (editingId) {
      updateSchedule(editingId, {
        title: formTitle,
        date: formDate,
        time: formTime,
        speaker: formSpeaker,
        description: formDescription,
        isSpecial: formIsSpecial,
        thumbnail,
      });
    } else {
      addSchedule({
        title: formTitle,
        date: formDate,
        time: formTime,
        speaker: formSpeaker,
        description: formDescription,
        isSpecial: formIsSpecial,
        isLive: false,
        thumbnail,
      });
    }
    
    setSchedules(getSchedules());
    resetForm();
  };

  const handleEditSchedule = (schedule: ScheduledService) => {
    setEditingId(schedule.id);
    setFormTitle(schedule.title);
    setFormDate(schedule.date);
    setFormTime(schedule.time);
    setFormSpeaker(schedule.speaker);
    setFormDescription(schedule.description || '');
    setFormIsSpecial(schedule.isSpecial || false);
    setFormThumbnail(schedule.thumbnail || '');
    setShowAddForm(true);
  };

  const handleDeleteSchedule = (id: string) => {
    deleteSchedule(id);
    setSchedules(getSchedules());
  };

  const getServiceStatus = (date: string, time: string) => {
    const serviceDate = new Date(`${date} ${time}`);
    const now = new Date();
    const diff = serviceDate.getTime() - now.getTime();
    if (diff < 0) return 'past';
    if (diff < 60 * 60 * 1000) return 'soon'; // within 1 hour
    return 'upcoming';
  };

  const youtubeVideoId = extractYouTubeId(youtubeInput) || youtubeInput;

  // Build chat config from state
  const getChatConfig = (): ChatConfig => ({
    enabled: chatEnabled,
    source: chatSource,
    approvalMode: chatApprovalMode,
    showViewerCount,
    allowGuestComments,
    slowModeSeconds,
    maxMessageLength,
    blockedWords: blockedWordsInput
      .split(',')
      .map(w => w.trim().toLowerCase())
      .filter(Boolean),
    welcomeMessage,
  });

  // Save stream config to localStorage — applies instantly to the live page
  const handleSave = () => {
    saveStreamConfig({
      platform,
      youtubeVideoId: platform === 'youtube' ? youtubeVideoId : '',
      youtubeLiveChannelId: platform === 'youtube' ? youtubeChannelId : '',
      facebookVideoUrl: platform === 'facebook' ? facebookUrl : '',
      isLive,
      chat: getChatConfig(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Auto-save live toggle immediately
  const handleToggleLive = () => {
    const newLive = !isLive;
    setIsLive(newLive);
    saveStreamConfig({
      platform,
      youtubeVideoId: platform === 'youtube' ? youtubeVideoId : '',
      youtubeLiveChannelId: platform === 'youtube' ? youtubeChannelId : '',
      facebookVideoUrl: platform === 'facebook' ? facebookUrl : '',
      isLive: newLive,
      chat: getChatConfig(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 md:pb-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Page Header */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
              <Settings className="w-5 h-5 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
              Stream Settings
            </h1>
            <p className="text-sm sm:text-base text-foreground/70">
              Configure your live stream connection for OBS Studio
            </p>
          </div>

          {/* Live Status Toggle */}
          <div className={`rounded-xl border-2 p-4 sm:p-6 transition-colors ${
            isLive ? 'border-red-500/50 bg-red-500/5' : 'border-border bg-card'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  {isLive ? <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" /> : <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/50 flex-shrink-0" />}
                  Stream Status
                </h2>
                <p className="text-xs sm:text-sm text-foreground/70">
                  {isLive ? 'Your stream is marked as LIVE' : 'Your stream is currently offline'}
                </p>
              </div>
              <button
                onClick={handleToggleLive}
                className={`relative w-16 h-8 rounded-full transition-colors ${
                  isLive ? 'bg-red-500' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                  isLive ? 'left-9' : 'left-1'
                }`} />
              </button>
            </div>
            {isLive && (
              <div className="mt-3 sm:mt-4 flex items-center gap-2 flex-wrap">
                <Badge className="bg-red-600 text-white border-0 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
                <span className="text-xs sm:text-sm text-foreground/70">
                  Remember to start streaming in OBS before toggling this on
                </span>
              </div>
            )}
          </div>

          {/* Platform Selection */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground">Streaming Platform</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setPlatform('youtube')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                  platform === 'youtube'
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-border hover:border-foreground/30 bg-card'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Youtube className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">YouTube Live</h3>
                    <p className="text-xs text-foreground/50">Recommended</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">
                  Stream via YouTube and embed the live player
                </p>
              </button>

              <button
                onClick={() => setPlatform('facebook')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                  platform === 'facebook'
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-border hover:border-foreground/30 bg-card'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Facebook Live</h3>
                    <p className="text-xs text-foreground/50">Alternative</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">
                  Stream via Facebook and embed the live video
                </p>
              </button>
            </div>
          </div>

          {/* Platform Configuration */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {platform === 'youtube' ? 'YouTube Configuration' : 'Facebook Configuration'}
            </h2>

            {platform === 'youtube' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    YouTube Video/Stream URL or ID
                  </label>
                  <Input
                    placeholder="e.g., https://youtube.com/watch?v=dQw4w9WgXcQ or just the ID"
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    className="font-mono"
                  />
                  {youtubeVideoId && youtubeInput && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Detected Video ID: <code className="bg-muted px-1 rounded">{youtubeVideoId}</code>
                    </p>
                  )}
                  <p className="text-xs text-foreground/50">
                    Paste the full YouTube URL or just the video ID. Works with youtube.com/watch, youtu.be, and youtube.com/live URLs.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    YouTube Channel ID <span className="text-foreground/50">(optional)</span>
                  </label>
                  <Input
                    placeholder="e.g., UCxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={youtubeChannelId}
                    onChange={(e) => setYoutubeChannelId(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-foreground/50">
                    If provided, can auto-embed your live stream. Find it at{' '}
                    <a
                      href="https://youtube.com/account_advanced"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      youtube.com/account_advanced <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Facebook Video URL
                </label>
                <Input
                  placeholder="e.g., https://www.facebook.com/YourPage/videos/123456789"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-foreground/50">
                  Paste the full Facebook video URL from your live stream
                </p>
              </div>
            )}
          </div>

          {/* Save & Apply */}
          <div className="rounded-xl border-2 border-primary/30 bg-card p-4 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                Apply Configuration
              </h2>
              <p className="text-xs sm:text-sm text-foreground/70">
                Save your settings — the live page will update instantly
              </p>
            </div>

            {/* Current Config Summary */}
            <div className="bg-black rounded-lg p-3 sm:p-4 space-y-2 text-xs sm:text-sm font-mono overflow-x-auto">
              <div className="flex items-center gap-2">
                <span className="text-foreground/50">Platform:</span>
                <span className="text-green-400">{platform}</span>
              </div>
              {platform === 'youtube' && youtubeVideoId && (
                <div className="flex items-center gap-2">
                  <span className="text-foreground/50">Video ID:</span>
                  <span className="text-green-400">{youtubeVideoId}</span>
                </div>
              )}
              {platform === 'youtube' && youtubeChannelId && (
                <div className="flex items-center gap-2">
                  <span className="text-foreground/50">Channel ID:</span>
                  <span className="text-green-400">{youtubeChannelId}</span>
                </div>
              )}
              {platform === 'facebook' && facebookUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-foreground/50">Facebook URL:</span>
                  <span className="text-green-400 break-all">{facebookUrl}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-foreground/50">Status:</span>
                <span className={isLive ? 'text-red-400' : 'text-foreground/50'}>
                  {isLive ? '🔴 LIVE' : '⚫ Offline'}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button onClick={handleSave} className="gap-2 w-full sm:w-auto" size="lg">
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Settings Saved!' : 'Save & Apply Settings'}
              </Button>
              {saved && (
                <span className="text-sm text-green-500 font-medium">
                  ✓ Live page will reflect these changes
                </span>
              )}
            </div>

            <div className="flex items-start gap-2 bg-primary/10 border border-primary/20 rounded-lg p-3">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
                Settings are saved locally on this device. Refresh the <strong>/live</strong> page to see changes take effect.
                When your stream ends, come back here and toggle the status to Offline.
              </p>
            </div>
          </div>

          {/* ━━━ Live Chat Configuration ━━━ */}
          <div className="rounded-xl border-2 border-border bg-card overflow-hidden">
            {/* Collapsible Header */}
            <button 
              onClick={() => setShowChatSettings(!showChatSettings)}
              className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    Live Comments
                    <Badge variant={chatEnabled ? 'default' : 'secondary'} className="text-[10px]">
                      {chatEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </h2>
                  <p className="text-xs sm:text-sm text-foreground/70">
                    Configure chat source, moderation, and viewer settings
                  </p>
                </div>
              </div>
              {showChatSettings ? (
                <ChevronUp className="w-5 h-5 text-foreground/50 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground/50 flex-shrink-0" />
              )}
            </button>

            {/* Expandable Content */}
            {showChatSettings && (
              <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-6 border-t border-border pt-4">
                {/* Enable/Disable Chat */}
                <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      {chatEnabled ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-foreground/50" />}
                      Enable Live Comments
                    </h3>
                    <p className="text-xs text-foreground/70">
                      {chatEnabled ? 'Viewers can see and interact with the chat' : 'Chat is hidden from viewers'}
                    </p>
                  </div>
                  <button
                    onClick={() => setChatEnabled(!chatEnabled)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      chatEnabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${
                      chatEnabled ? 'left-7' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {chatEnabled && (
                  <>
                    {/* Chat Source Selection */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-foreground">Chat Source</h3>
                      
                      {/* Note about YouTube embed */}
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-foreground/70">
                        <p className="font-medium text-yellow-600 mb-1">⚠️ YouTube Embed Note:</p>
                        <p>YouTube may block chat embedding on localhost. It works best when deployed to your actual domain. A "Open in new window" link is provided as fallback.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <button
                          onClick={() => setChatSource('youtube-embed')}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                            chatSource === 'youtube-embed'
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-border hover:border-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Youtube className="w-4 h-4 text-red-500" />
                            <span className="font-semibold text-sm">YouTube Embed</span>
                            <Badge className="text-[10px] bg-red-500/20 text-red-500 border-0">Recommended</Badge>
                          </div>
                          <p className="text-[10px] sm:text-xs text-foreground/60">
                            Embed native YouTube live chat (no API needed)
                          </p>
                        </button>

                        <button
                          onClick={() => setChatSource('youtube')}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                            chatSource === 'youtube'
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-border hover:border-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Youtube className="w-4 h-4 text-red-500" />
                            <span className="font-semibold text-sm">YouTube API</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-foreground/60">
                            Fetch chat via API (quota limited)
                          </p>
                        </button>

                        <button
                          onClick={() => setChatSource('internal')}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                            chatSource === 'internal'
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-sm">Internal Chat</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-foreground/60">
                            Use our built-in chat system
                          </p>
                        </button>

                        <button
                          onClick={() => setChatSource('both')}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                            chatSource === 'both'
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-border hover:border-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-sm">Both</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-foreground/60">
                            YouTube API + internal chat
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Moderation Settings */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Moderation
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => setChatApprovalMode('auto')}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            chatApprovalMode === 'auto'
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-border hover:border-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-sm">Auto-Approve</span>
                          </div>
                          <p className="text-xs text-foreground/60">Messages appear instantly</p>
                        </button>

                        <button
                          onClick={() => setChatApprovalMode('manual')}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            chatApprovalMode === 'manual'
                              ? 'border-yellow-500 bg-yellow-500/10'
                              : 'border-border hover:border-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold text-sm">Manual Approval</span>
                          </div>
                          <p className="text-xs text-foreground/60">Review messages first</p>
                        </button>
                      </div>
                    </div>

                    {/* Quick Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Show Viewer Count */}
                      <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium">Show Viewer Count</span>
                        </div>
                        <button
                          onClick={() => setShowViewerCount(!showViewerCount)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            showViewerCount ? 'bg-primary' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                            showViewerCount ? 'left-5' : 'left-0.5'
                          }`} />
                        </button>
                      </div>

                      {/* Allow Guest Comments */}
                      <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          {allowGuestComments ? (
                            <UserCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <UserX className="w-4 h-4 text-foreground/50 flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium">Allow Guests</span>
                        </div>
                        <button
                          onClick={() => setAllowGuestComments(!allowGuestComments)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            allowGuestComments ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                            allowGuestComments ? 'left-5' : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Settings className="w-4 h-4 text-foreground/70" />
                        Advanced Settings
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Slow Mode */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Timer className="w-4 h-4 text-foreground/70" />
                            Slow Mode (seconds)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max="300"
                            value={slowModeSeconds}
                            onChange={(e) => setSlowModeSeconds(parseInt(e.target.value) || 0)}
                            placeholder="0 = disabled"
                          />
                          <p className="text-[10px] text-foreground/50">
                            Delay between messages (0 = off)
                          </p>
                        </div>

                        {/* Max Message Length */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-foreground/70" />
                            Max Message Length
                          </label>
                          <Input
                            type="number"
                            min="50"
                            max="2000"
                            value={maxMessageLength}
                            onChange={(e) => setMaxMessageLength(parseInt(e.target.value) || 500)}
                          />
                          <p className="text-[10px] text-foreground/50">
                            Characters per message (50-2000)
                          </p>
                        </div>
                      </div>

                      {/* Blocked Words */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Ban className="w-4 h-4 text-red-500" />
                          Blocked Words
                        </label>
                        <Input
                          value={blockedWordsInput}
                          onChange={(e) => setBlockedWordsInput(e.target.value)}
                          placeholder="spam, bad, inappropriate (comma separated)"
                        />
                        <p className="text-[10px] text-foreground/50">
                          Messages with these words will be filtered
                        </p>
                      </div>

                      {/* Welcome Message */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Welcome Message
                        </label>
                        <Input
                          value={welcomeMessage}
                          onChange={(e) => setWelcomeMessage(e.target.value)}
                          placeholder="Welcome to the live service! 🙏"
                        />
                        <p className="text-[10px] text-foreground/50">
                          Displayed when user joins the chat
                        </p>
                      </div>
                    </div>

                    {/* Config Summary */}
                    <div className="bg-black rounded-lg p-3 font-mono text-xs space-y-1 overflow-x-auto">
                      <div className="text-foreground/50">// Chat Config Preview</div>
                      <div><span className="text-foreground/50">source:</span> <span className="text-green-400">{chatSource}</span></div>
                      <div><span className="text-foreground/50">approval:</span> <span className="text-green-400">{chatApprovalMode}</span></div>
                      <div><span className="text-foreground/50">viewers:</span> <span className={showViewerCount ? 'text-green-400' : 'text-red-400'}>{showViewerCount ? 'visible' : 'hidden'}</span></div>
                      <div><span className="text-foreground/50">guests:</span> <span className={allowGuestComments ? 'text-green-400' : 'text-red-400'}>{allowGuestComments ? 'allowed' : 'disabled'}</span></div>
                      {slowModeSeconds > 0 && (
                        <div><span className="text-foreground/50">slowMode:</span> <span className="text-yellow-400">{slowModeSeconds}s</span></div>
                      )}
                    </div>

                    {/* Save Chat Settings Button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-border">
                      <Button onClick={handleSave} className="gap-2 w-full sm:w-auto" size="lg">
                        {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? 'Settings Saved!' : 'Save All Settings'}
                      </Button>
                      {saved && (
                        <span className="text-sm text-green-500 font-medium">
                          ✓ Chat settings applied
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ━━━ Service Schedule Manager ━━━ */}
          <div className="rounded-xl border-2 border-primary/30 bg-card p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <CalendarPlus className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  Service Schedules
                </h2>
                <p className="text-xs sm:text-sm text-foreground/70">
                  Add services — the live page countdown & upcoming list will update automatically
                </p>
              </div>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)} className="gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              )}
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                    {editingId ? <Edit2 className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                    {editingId ? 'Edit Service' : 'New Service'}
                  </h3>
                  <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <X className="w-4 h-4 text-foreground/50" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Service Title *</label>
                    <Input
                      placeholder="e.g., Wednesday Midweek Service"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Date *</label>
                    <Input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Time *</label>
                    <Input
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                    />
                  </div>

                  {/* Speaker */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Speaker / Man of God</label>
                    <Input
                      placeholder="e.g., Apst Emmanuel Etim"
                      value={formSpeaker}
                      onChange={(e) => setFormSpeaker(e.target.value)}
                    />
                  </div>

                  {/* Thumbnail URL */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Thumbnail URL <span className="text-foreground/50">(optional)</span>
                    </label>
                    <Input
                      placeholder="https://... (leave blank for default)"
                      value={formThumbnail}
                      onChange={(e) => setFormThumbnail(e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Description <span className="text-foreground/50">(optional)</span>
                    </label>
                    <Input
                      placeholder="e.g., Special anointing service, guest minister..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>

                  {/* Special Service Toggle */}
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button
                      onClick={() => setFormIsSpecial(!formIsSpecial)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formIsSpecial ? 'bg-primary' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                        formIsSpecial ? 'left-6' : 'left-0.5'
                      }`} />
                    </button>
                    <div>
                      <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-500" />
                        Special Service
                      </span>
                      <p className="text-xs text-foreground/50">Mark as a special/one-time event (shows a highlight badge)</p>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Button onClick={handleAddSchedule} disabled={!formTitle || !formDate || !formTime} className="gap-2 w-full sm:w-auto">
                    <Save className="w-4 h-4" />
                    {editingId ? 'Update Service' : 'Add Service'}
                  </Button>
                  <Button variant="outline" onClick={resetForm} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Schedules List */}
            {schedules.length > 0 ? (
              <div className="space-y-3">
                {schedules
                  .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
                  .map((schedule) => {
                    const status = getServiceStatus(schedule.date, schedule.time);
                    const formattedDate = new Date(schedule.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    // Convert 24h time to 12h display
                    const timeParts = schedule.time.match(/(\d+):(\d+)/);
                    let displayTime = schedule.time;
                    if (timeParts) {
                      const h = parseInt(timeParts[1]);
                      const m = timeParts[2];
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                      displayTime = `${h12}:${m} ${ampm}`;
                    }

                    return (
                      <div
                        key={schedule.id}
                        className={`rounded-lg border p-4 transition-colors ${
                          status === 'past'
                            ? 'border-border/50 bg-muted/30 opacity-60'
                            : status === 'soon'
                            ? 'border-red-500/50 bg-red-500/5'
                            : 'border-border bg-card hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                              <h4 className="font-bold text-foreground text-xs sm:text-sm truncate max-w-[180px] sm:max-w-none">{schedule.title}</h4>
                              {schedule.isSpecial && (
                                <Badge className="bg-yellow-500/20 text-yellow-600 border-0 text-[10px] h-5">
                                  <Star className="w-3 h-3 mr-0.5" />
                                  SPECIAL
                                </Badge>
                              )}
                              {status === 'soon' && (
                                <Badge className="bg-red-600 text-white border-0 text-[10px] h-5 animate-pulse">
                                  STARTING SOON
                                </Badge>
                              )}
                              {status === 'past' && (
                                <Badge variant="outline" className="text-[10px] h-5 text-foreground/50">
                                  PAST
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-foreground/60 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formattedDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {displayTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {schedule.speaker}
                              </span>
                            </div>
                            {schedule.description && (
                              <p className="text-xs text-foreground/50 mt-1.5 line-clamp-1">{schedule.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleEditSchedule(schedule)}
                              className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/50 hover:text-primary"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-foreground/50 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-foreground/50 space-y-2">
                <CalendarPlus className="w-10 h-10 mx-auto text-foreground/30" />
                <p className="text-sm font-medium">No services scheduled</p>
                <p className="text-xs">Click &quot;Add Service&quot; to create your first schedule</p>
              </div>
            )}
          </div>

          {/* OBS Setup Guide */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setShowOBSGuide(!showOBSGuide)}
              className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors gap-3">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2 text-left">
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                OBS Studio Setup Guide
              </h2>
              {showOBSGuide ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
            </button>

            {showOBSGuide && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6 border-t border-border pt-4">
                {/* YouTube Guide */}
                {platform === 'youtube' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-500" />
                      Streaming to YouTube Live
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          step: 1,
                          title: 'Open YouTube Studio',
                          desc: 'Go to studio.youtube.com → Click "Go Live" or the Create (+) button → "Go Live"',
                        },
                        {
                          step: 2,
                          title: 'Get Stream Key',
                          desc: 'In YouTube Live Control Room, click "Stream" tab → Copy your Stream Key',
                        },
                        {
                          step: 3,
                          title: 'Configure OBS',
                          desc: 'Open OBS → Settings → Stream → Service: "YouTube - RTMPS" → Paste Stream Key → OK',
                        },
                        {
                          step: 4,
                          title: 'Set Video Settings',
                          desc: 'OBS → Settings → Output → Bitrate: 4500-6000 Kbps → Encoder: x264 or NVENC → Resolution: 1920x1080',
                        },
                        {
                          step: 5,
                          title: 'Start Streaming',
                          desc: 'Click "Start Streaming" in OBS → Wait for YouTube to show "Live" status',
                        },
                        {
                          step: 6,
                          title: 'Copy Video URL',
                          desc: 'From YouTube Live dashboard, copy the live stream URL (e.g., youtube.com/watch?v=XXXX) → Paste the video ID in the YouTube Configuration above',
                        },
                        {
                          step: 7,
                          title: 'Go Live on SLIC Nations',
                          desc: 'Toggle "Stream Status" to LIVE above → Click "Save & Apply Settings" → Your audience can watch on the /live page!',
                        },
                      ].map((item) => (
                        <div key={item.step} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-bold text-sm">
                            {item.step}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-foreground/70">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Recommended OBS Settings for YouTube
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-background rounded p-2">
                          <span className="text-foreground/50">Bitrate:</span>{' '}
                          <span className="text-foreground font-medium">4500-6000 Kbps</span>
                        </div>
                        <div className="bg-background rounded p-2">
                          <span className="text-foreground/50">Resolution:</span>{' '}
                          <span className="text-foreground font-medium">1920x1080</span>
                        </div>
                        <div className="bg-background rounded p-2">
                          <span className="text-foreground/50">FPS:</span>{' '}
                          <span className="text-foreground font-medium">30</span>
                        </div>
                        <div className="bg-background rounded p-2">
                          <span className="text-foreground/50">Encoder:</span>{' '}
                          <span className="text-foreground font-medium">x264 or NVENC</span>
                        </div>
                        <div className="bg-background rounded p-2">
                          <span className="text-foreground/50">Audio Bitrate:</span>{' '}
                          <span className="text-foreground font-medium">128-160 Kbps</span>
                        </div>
                        <div className="bg-background rounded p-2">
                          <span className="text-foreground/50">Keyframe:</span>{' '}
                          <span className="text-foreground font-medium">2 seconds</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Facebook Guide */}
                {platform === 'facebook' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-500" />
                      Streaming to Facebook Live
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          step: 1,
                          title: 'Open Facebook Live Producer',
                          desc: 'Go to facebook.com/live/producer → Select your Page/Profile',
                        },
                        {
                          step: 2,
                          title: 'Get Stream Key',
                          desc: 'Under "Set up live video" → Select "Streaming software" → Copy Stream Key',
                        },
                        {
                          step: 3,
                          title: 'Configure OBS',
                          desc: 'Open OBS → Settings → Stream → Service: "Facebook Live" → Paste Stream Key → OK',
                        },
                        {
                          step: 4,
                          title: 'Start Streaming',
                          desc: 'Click "Start Streaming" in OBS → Go back to Facebook and click "Go Live"',
                        },
                        {
                          step: 5,
                          title: 'Copy Video URL',
                          desc: 'From Facebook, copy the live video URL → Paste it in the Facebook Video URL field above',
                        },
                        {
                          step: 6,
                          title: 'Go Live on SLIC Nations',
                          desc: 'Toggle "Stream Status" to LIVE above → Click "Save & Apply Settings"',
                        },
                      ].map((item) => (
                        <div key={item.step} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                            {item.step}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-foreground/70">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* General Tips */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    Tips for Best Streaming Quality
                  </h4>
                  <ul className="text-xs text-foreground/70 space-y-1 list-disc list-inside">
                    <li>Use a wired ethernet connection instead of WiFi for stability</li>
                    <li>Close unnecessary programs to free up CPU/GPU resources</li>
                    <li>Do a test stream before going live to check audio/video quality</li>
                    <li>Have a backup internet connection ready if possible</li>
                    <li>Start streaming in OBS first, then toggle Live status on the website</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNavBar />
    </div>
  );
}

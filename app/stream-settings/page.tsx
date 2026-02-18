'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Radio,
  Youtube,
  Facebook,
  Copy,
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
} from 'lucide-react';
import { StreamPlatform } from '@/lib/types';
import { extractYouTubeId } from '@/lib/streamConfig';

export default function StreamSettingsPage() {
  const [platform, setPlatform] = useState<StreamPlatform>('youtube');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [youtubeChannelId, setYoutubeChannelId] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [showOBSGuide, setShowOBSGuide] = useState(false);
  const [copied, setCopied] = useState('');
  const [saved, setSaved] = useState(false);

  const youtubeVideoId = extractYouTubeId(youtubeInput) || youtubeInput;

  const handleSave = () => {
    // In production, this would save to a database/API
    // For now, we show what to update in streamConfig.ts
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const configCode = `// Update lib/streamConfig.ts with these values:
export const streamConfig: StreamConfig = {
  platform: '${platform}',
  youtubeVideoId: '${platform === 'youtube' ? youtubeVideoId : ''}',
  youtubeLiveChannelId: '${platform === 'youtube' ? youtubeChannelId : ''}',
  facebookVideoUrl: '${platform === 'facebook' ? facebookUrl : ''}',
  isLive: ${isLive},
};`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Settings className="w-7 h-7 text-primary" />
              Stream Settings
            </h1>
            <p className="text-foreground/70">
              Configure your live stream connection for OBS Studio
            </p>
          </div>

          {/* Live Status Toggle */}
          <div className={`rounded-xl border-2 p-6 transition-colors ${
            isLive ? 'border-red-500/50 bg-red-500/5' : 'border-border bg-card'
          }`}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  {isLive ? <Wifi className="w-5 h-5 text-red-500" /> : <WifiOff className="w-5 h-5 text-foreground/50" />}
                  Stream Status
                </h2>
                <p className="text-sm text-foreground/70">
                  {isLive ? 'Your stream is marked as LIVE' : 'Your stream is currently offline'}
                </p>
              </div>
              <button
                onClick={() => setIsLive(!isLive)}
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
              <div className="mt-4 flex items-center gap-2">
                <Badge className="bg-red-600 text-white border-0 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
                <span className="text-sm text-foreground/70">
                  Remember to start streaming in OBS before toggling this on
                </span>
              </div>
            )}
          </div>

          {/* Platform Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Streaming Platform</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPlatform('youtube')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
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
                className={`p-6 rounded-xl border-2 transition-all text-left ${
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
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h2 className="text-lg font-bold text-foreground">
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

          {/* Generated Config */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Generated Configuration
              </h2>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => copyToClipboard(configCode, 'config')}
              >
                {copied === 'config' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'config' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="bg-black rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono whitespace-pre">{configCode}</pre>
            </div>
            <div className="flex items-start gap-2 bg-primary/10 border border-primary/20 rounded-lg p-3">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
                Copy this config and update <code className="bg-muted px-1 rounded">lib/streamConfig.ts</code> in your project.
                In a future update, this will save directly to a database.
              </p>
            </div>
          </div>

          {/* OBS Setup Guide */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setShowOBSGuide(!showOBSGuide)}
              className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                OBS Studio Setup Guide
              </h2>
              {showOBSGuide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showOBSGuide && (
              <div className="px-6 pb-6 space-y-6 border-t border-border pt-4">
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
                          desc: 'From YouTube Live dashboard, copy the live stream URL (e.g., youtube.com/watch?v=XXXX) → Paste the video ID above',
                        },
                        {
                          step: 7,
                          title: 'Go Live on SLIC Nations',
                          desc: 'Toggle "Stream Status" to LIVE above → Update streamConfig.ts → Your audience can watch!',
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
                      <div className="grid grid-cols-2 gap-2 text-xs">
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
                          desc: 'Toggle "Stream Status" to LIVE above → Update streamConfig.ts',
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
    </div>
  );
}

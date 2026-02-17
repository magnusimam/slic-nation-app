'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LIVE_SERVICES } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Calendar, Clock, Users } from 'lucide-react';

export default function LivePage() {
  const currentService = LIVE_SERVICES[0];
  const upcomingServices = LIVE_SERVICES.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Live Services</h1>
          <p className="text-foreground/70 text-lg">
            Join us for live worship and teachings. Experience the presence of God with our community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
              {/* Placeholder for video player */}
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url('${currentService.thumbnail}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center"
                  >
                    <Play className="w-8 h-8 fill-current" />
                  </Button>
                </div>

                {/* Live Badge */}
                {currentService.isLive && (
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="font-bold text-sm">LIVE NOW</span>
                  </div>
                )}

                {/* Viewer Count */}
                {currentService.isLive && (
                  <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">12,450 watching</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {currentService.title}
                  </h2>
                  <p className="text-foreground/70">Led by {currentService.speaker}</p>
                </div>
                {currentService.isLive && (
                  <Badge className="bg-red-600 hover:bg-red-600 flex-shrink-0">
                    LIVE
                  </Badge>
                )}
              </div>

              {/* Service Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
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

              {/* Chat/Comments Section */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Live Chat</h3>
                <div className="space-y-3 mb-4 h-64 overflow-y-auto border border-border rounded-lg p-4">
                  <div className="text-sm text-foreground/70 text-center py-20">
                    Chat is disabled for now. Join us live to participate!
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-foreground/50 outline-none focus:ring-2 focus:ring-primary"
                    disabled
                  />
                  <Button disabled className="bg-primary/50">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Services */}
            <div className="bg-card rounded-lg p-6 border border-border space-y-4">
              <h3 className="font-semibold text-foreground text-lg">Upcoming Services</h3>
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

            {/* Tips */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-6 border border-primary/30 space-y-4">
              <h3 className="font-semibold text-foreground">Pro Tips</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Join 5 minutes early for worship</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Open your Bible for scripture references</span>
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

      <Footer />
    </div>
  );
}

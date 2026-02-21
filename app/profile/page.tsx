'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoCard } from '@/components/VideoCard';
import { VideoModal } from '@/components/VideoModal';
import { getVideos, type ManagedVideo } from '@/lib/contentManager';
import { User, Mail, LogOut, Settings, History, Bookmark, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/lib/supabase/profiles';
import { getWatchHistory, getSavedItems } from '@/lib/supabase/userContent';
import { getUserDonations } from '@/lib/supabase/donations';
import { getVideos as getSupabaseVideos } from '@/lib/supabase/videos';

type ProfileTab = 'profile' | 'history' | 'saved' | 'donations';

export default function ProfilePage() {
  const { user, profile: authProfile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ManagedVideo | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    joinDate: '',
  });
  
  // Load data from Supabase
  const [watchHistory, setWatchHistory] = useState<ManagedVideo[]>([]);
  const [savedContent, setSavedContent] = useState<ManagedVideo[]>([]);
  const [donations, setDonations] = useState<{id: string | number; amount: number; type: string; date: string; description: string}[]>([]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Populate profile from auth
  useEffect(() => {
    if (user && authProfile) {
      setProfile({
        name: authProfile.display_name || user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: authProfile.phone || '',
        location: authProfile.location || '',
        joinDate: user.created_at || '',
      });
    }
  }, [user, authProfile]);

  // Load watch history, saved items, donations
  useEffect(() => {
    if (!user) return;
    async function loadUserData() {
      try {
        // Watch history
        const history = await getWatchHistory(user!.id);
        setWatchHistory(history.map(h => h.video).filter(Boolean) as ManagedVideo[]);
      } catch { /* fallback: empty */ }
      try {
        // Saved items (videos)
        const saved = await getSavedItems(user!.id, 'video');
        setSavedContent(saved.map(s => s.video).filter(Boolean) as ManagedVideo[]);
      } catch { /* fallback: empty */ }
      try {
        // Donations
        const donData = await getUserDonations(user!.id);
        setDonations(donData.map(d => ({
          id: d.id,
          amount: d.amount,
          type: d.type,
          date: d.created_at,
          description: d.message || d.type,
        })));
      } catch { /* fallback: empty */ }
    }
    loadUserData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (user) {
      try {
        await updateProfile(user.id, {
          display_name: profile.name,
          phone: profile.phone,
          location: profile.location,
        });
      } catch (err) {
        console.error('Failed to update profile:', err);
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1 order-1">
            <div className="bg-card rounded-lg border border-border p-4 md:p-6 lg:sticky lg:top-20 space-y-4 md:space-y-6">
              {/* Avatar */}
              <div className="flex flex-row lg:flex-col items-center gap-4 lg:space-y-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                </div>
                <div className="text-left lg:text-center">
                  <h2 className="font-bold text-foreground text-sm md:text-base">{profile.name}</h2>
                  <p className="text-xs md:text-sm text-foreground/70">{profile.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 py-3 md:py-4 border-y border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{watchHistory.length}</p>
                  <p className="text-xs text-foreground/70">Watched</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{savedContent.length}</p>
                  <p className="text-xs text-foreground/70">Saved</p>
                </div>
              </div>

              {/* Navigation Tabs - Horizontal on mobile, vertical on desktop */}
              <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'history', label: 'History', icon: History },
                  { id: 'saved', label: 'Saved', icon: Bookmark },
                  { id: 'donations', label: 'Donations', icon: Heart },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as ProfileTab)}
                    className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 lg:w-full ${
                      activeTab === id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted lg:bg-transparent text-foreground/70 hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs md:text-sm font-medium">{label}</span>
                  </button>
                ))}
              </nav>

              <Button variant="outline" className="w-full text-foreground border-border gap-2 text-sm hidden lg:flex" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8 order-2">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-card rounded-lg border border-border p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">Profile Settings</h2>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="py-6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className="py-6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      className="py-6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Location
                    </label>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      disabled={!isEditing}
                      className="py-6"
                    />
                  </div>

                  <div className="pt-6 border-t border-border">
                    <p className="text-sm text-foreground/70">
                      Member since {new Date(profile.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Watch History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Watch History</h2>
                {watchHistory.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {watchHistory.map((video) => (
                      <VideoCard key={video.id} video={video} onPlay={() => setSelectedVideo(video)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12 bg-card rounded-lg border border-border">
                    <History className="w-10 h-10 md:w-12 md:h-12 text-foreground/30 mx-auto mb-3 md:mb-4" />
                    <p className="text-sm md:text-base text-foreground/70 px-4">No watch history yet. Start watching to build your history.</p>
                  </div>
                )}
              </div>
            )}

            {/* Saved Items Tab */}
            {activeTab === 'saved' && (
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Saved Items</h2>
                {savedContent.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {savedContent.map((video) => (
                      <VideoCard key={video.id} video={video} onPlay={() => setSelectedVideo(video)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12 bg-card rounded-lg border border-border">
                    <Bookmark className="w-10 h-10 md:w-12 md:h-12 text-foreground/30 mx-auto mb-3 md:mb-4" />
                    <p className="text-sm md:text-base text-foreground/70 px-4">No saved items yet. Save your favorites to watch later.</p>
                  </div>
                )}
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">Donation History</h2>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-fit">
                    <Heart className="w-4 h-4" />
                    Give Now
                  </Button>
                </div>

                {donations.length > 0 ? (
                  <div className="space-y-3">
                    {donations.map((donation) => (
                      <div
                        key={donation.id}
                        className="bg-card rounded-lg border border-border p-4 md:p-6 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm md:text-base">{donation.type}</p>
                            <p className="text-xs md:text-sm text-foreground/70 truncate">{donation.description}</p>
                            <p className="text-xs text-foreground/50 mt-0.5 md:mt-1">
                              {new Date(donation.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl md:text-2xl font-bold text-primary">${donation.amount}</p>
                        </div>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg border border-primary/30 p-4 md:p-6 mt-4 md:mt-6">
                      <p className="text-xs md:text-sm text-foreground/70 mb-1 md:mb-2">Total Donations</p>
                      <p className="text-2xl md:text-3xl font-bold text-primary">
                        ${donations.reduce((sum, d) => sum + d.amount, 0)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12 bg-card rounded-lg border border-border">
                    <Heart className="w-10 h-10 md:w-12 md:h-12 text-foreground/30 mx-auto mb-3 md:mb-4" />
                    <p className="text-sm md:text-base text-foreground/70 px-4">No donations yet. Support our ministry with a gift.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}

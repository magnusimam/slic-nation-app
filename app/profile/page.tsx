'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoCard } from '@/components/VideoCard';
import { SERMON_VIDEOS } from '@/lib/mockData';
import { User, Mail, LogOut, Settings, History, Bookmark, Heart } from 'lucide-react';

type ProfileTab = 'profile' | 'history' | 'saved' | 'donations';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2023-01-15',
  });

  const watchHistory = SERMON_VIDEOS.slice(0, 4);
  const savedContent = SERMON_VIDEOS.slice(2, 6);
  const donations = [
    { id: 1, amount: 50, type: 'Offering', date: '2024-02-15', description: 'Sunday Service' },
    { id: 2, amount: 100, type: 'Tithe', date: '2024-02-12', description: 'Monthly Tithe' },
    { id: 3, amount: 25, type: 'Offering', date: '2024-02-10', description: 'Special Project' },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-20 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h2 className="font-bold text-foreground">{profile.name}</h2>
                  <p className="text-sm text-foreground/70">{profile.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{watchHistory.length}</p>
                  <p className="text-xs text-foreground/70">Watched</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{savedContent.length}</p>
                  <p className="text-xs text-foreground/70">Saved</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'history', label: 'Watch History', icon: History },
                  { id: 'saved', label: 'Saved Items', icon: Bookmark },
                  { id: 'donations', label: 'Donations', icon: Heart },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as ProfileTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </nav>

              <Button variant="outline" className="w-full text-foreground border-border gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-card rounded-lg border border-border p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
                  <Button
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Watch History</h2>
                {watchHistory.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {watchHistory.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <History className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground/70">No watch history yet. Start watching content to build your history.</p>
                  </div>
                )}
              </div>
            )}

            {/* Saved Items Tab */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Saved Items</h2>
                {savedContent.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedContent.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Bookmark className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground/70">No saved items yet. Save your favorite sermons to watch later.</p>
                  </div>
                )}
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Donation History</h2>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Heart className="w-4 h-4" />
                    Give Now
                  </Button>
                </div>

                {donations.length > 0 ? (
                  <div className="space-y-3">
                    {donations.map((donation) => (
                      <div
                        key={donation.id}
                        className="bg-card rounded-lg border border-border p-6 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{donation.type}</p>
                            <p className="text-sm text-foreground/70">{donation.description}</p>
                            <p className="text-xs text-foreground/50 mt-1">
                              {new Date(donation.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${donation.amount}</p>
                        </div>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg border border-primary/30 p-6 mt-6">
                      <p className="text-sm text-foreground/70 mb-2">Total Donations</p>
                      <p className="text-3xl font-bold text-primary">
                        ${donations.reduce((sum, d) => sum + d.amount, 0)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Heart className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground/70">No donations yet. Support our ministry with a generous gift.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

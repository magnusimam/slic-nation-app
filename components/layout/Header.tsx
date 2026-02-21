'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, Bell, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/books', label: 'Books' },
    { href: '/live', label: 'Live' },
    { href: '/donate', label: 'Donate' },
  ];

  const showSolidBg = !transparent || isScrolled;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidBg 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="px-4 lg:px-12 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
              <Image
                src="/slicnation%20logo.jpg"
                alt="SLIC Nations"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 ml-8 lg:ml-12">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search */}
            <div className={`hidden sm:flex items-center transition-all duration-300 ${
              isSearchOpen 
                ? 'w-64 bg-black/60 border border-white/20' 
                : 'w-10 bg-transparent'
            } rounded-full overflow-hidden`}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-white/70 hover:text-white transition-colors flex-shrink-0"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Titles, speakers, topics..."
                  className="bg-transparent border-0 outline-none text-sm text-white placeholder:text-white/50 pr-4 w-full"
                  autoFocus
                />
              )}
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden lg:flex text-white/70 hover:text-white hover:bg-white/10 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* Profile / Auth */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  href="/profile"
                  className="flex items-center text-white/80 hover:text-white hover:bg-white/10 gap-2 rounded-md px-3 py-2 transition-colors"
                >
                  <div className="w-7 h-7 rounded bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="" width={28} height={28} className="w-full h-full rounded object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">{profile?.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="hidden sm:flex items-center text-white/80 hover:text-white hover:bg-white/10 gap-2 rounded-md px-3 py-2 transition-colors"
              >
                <div className="w-7 h-7 rounded bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden lg:inline text-sm font-medium">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

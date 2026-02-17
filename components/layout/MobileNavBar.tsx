'use client';

import Link from 'next/link';
import { Home, Play, BookOpen, Radio, Heart, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function MobileNavBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/library', icon: Play, label: 'Library' },
    { href: '/books', icon: BookOpen, label: 'Books' },
    { href: '/live', icon: Radio, label: 'Live' },
    { href: '/donate', icon: Heart, label: 'Donate' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-40">
      <div className="flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-4 px-2 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

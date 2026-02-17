'use client';

import Link from 'next/link';
import { Home, Play, BookOpen, Radio, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function MobileNavBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/categories', icon: Play, label: 'Watch' },
    { href: '/books', icon: BookOpen, label: 'Books' },
    { href: '/live', icon: Radio, label: 'Live' },
    { href: '/login', icon: User, label: 'Login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border md:hidden z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around pb-safe">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-primary'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

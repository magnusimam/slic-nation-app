import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { MobileNavBar } from '@/components/layout/MobileNavBar'
import { AudioProvider } from '@/components/AudioProvider'
import { MusicToggle } from '@/components/MusicToggle'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SLIC Nations - Streaming Ministry Platform',
  description: 'Experience powerful sermons, live services, digital books, and giving at SLIC Nations',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-background text-foreground pb-20 md:pb-0" suppressHydrationWarning>
        <AudioProvider>
          {children}
          <MusicToggle />
          <MobileNavBar />
        </AudioProvider>
      </body>
    </html>
  )
}

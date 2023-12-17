import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/globals.css';
import '@/styles/colors.css';

import { siteConfig } from '@/constant/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  authors: [
    {
      name: 'Eren Emmez',
      url: 'https://www.linkedin.com/in/erenemmez/',
    },
  ],
  keywords: [
    'Spotify otomatik çalma listesi',
    'Music sharing',
    'Beğenilen Şarkılar paylaşımı',
    'Public playlist',
    'Spotify araçları',
    'Automatic playlist creator',
    'Spotisync hizmeti',
    'Liked Songs sharing',
    'Müzik paylaşma servisi',
    'Spotify hesap entegrasyonu',
    'Automatic sharing tool',
    'Beğenilen şarkıları paylaş',
    'Spotisync auto playlist',
    'Liked Songs automatic sharing',
    'Spotify kullanıcı araçları',
    'Spotify auto playlist',
    'Music sharing',
    'Liked Songs sharing',
    'Public playlist',
    'Spotify tools',
    'Automatic playlist creator',
    'Spotisync service',
    'Liked Songs sharing',
    'Music sharing service',
    'Spotify account integration',
    'Automatic sharing tool',
    'Share Liked Songs',
    'Spotisync auto playlist',
    'Liked Songs automatic sharing',
    'Spotify user tools',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className='bg-dark'>{children}</body>
    </html>
  );
}

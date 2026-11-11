import type { Metadata, Viewport } from 'next';
import { Manrope, Tajawal } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GlobalFetchFeedback } from '@/components/ui/GlobalFetchFeedback';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import { Preloader } from '@/components/ui/Preloader';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-english',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nilorigen.com'),
  title: {
    default: 'Nilorigen Botanicals | أعشاب ونباتات مصرية للتصدير',
    template: '%s | Nilorigen Botanicals',
  },
  description:
    'مورد ومصدر مصري للأعشاب الطبية والعطرية والتوابل والمكونات النباتية، من أرض النيل إلى الأسواق العالمية.',
  keywords: [
    'Egyptian herbs exporter',
    'Egyptian medicinal herbs',
    'Egyptian aromatic herbs',
    'Egyptian spices exporter',
    'Essential oils Egypt',
    'Calendula exporter Egypt',
    'Chamomile exporter Egypt',
    'Hibiscus exporter Egypt',
    'Lemongrass Egypt',
    'Caraway seeds Egypt',
    'Sage leaves Egypt',
    'Spearmint peppermint Egypt',
    'Anise seeds Egypt',
    'Botanical ingredients supplier',
    'تصدير أعشاب طبية من مصر',
    'أعشاب عطرية مصرية',
    'توابل مصرية للتصدير',
    'Nilorigen botanicals',
  ],
  applicationName: 'Nilorigen Botanicals',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [{ url: '/logo/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
    shortcut: '/logo/icon.svg',
    apple: [{ url: '/icons/icon-192.png', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Nilorigen',
    statusBarStyle: 'default',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Nilorigen Botanicals | من أرض النيل إلى العالم',
    description: 'أعشاب طبية وعطرية وتوابل ومكونات نباتية مصرية للتوريد والتصدير إلى الأسواق العالمية.',
    url: 'https://nilorigen.com',
    siteName: 'Nilorigen Botanicals',
    locale: 'ar_EG',
    type: 'website',
    images: [
      {
        url: '/og/home.png',
        width: 1200,
        height: 630,
        alt: 'Nilorigen Botanicals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nilorigen Botanicals | أعشاب ونباتات مصرية',
    description: 'أعشاب طبية وعطرية وتوابل ومكونات نباتية من مصر للأسواق العالمية.',
    images: ['/og/home.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#073B2A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${manrope.variable} ${tajawal.variable} scroll-smooth`}
    >
      <body className="bg-darkgreen antialiased text-offwhite">
        <LanguageProvider>
          <Preloader />
          {children}
          <GlobalFetchFeedback />
          <PWAInstallPrompt />
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

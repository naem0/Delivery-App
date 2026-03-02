import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'DeliveryHobe! — 24/7 Emergency Delivery Service',
  description: 'Get anything delivered from your local dokans in Dhaka. Groceries, pharmacy, electronics — we have you covered 24/7.',
  keywords: 'delivery, grocery, bangladesh, dhaka, pharmacy, emergency delivery, online shopping',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: '#EF4444',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('qd_theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `
        }} />
      </head>
      <body className="antialiased bg-background text-foreground">
        <AuthProvider>
          <AppProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--card)',
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                },
              }}
            />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

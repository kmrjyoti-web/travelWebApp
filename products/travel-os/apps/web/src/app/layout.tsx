import type { Metadata } from 'next';
import { AppProviders } from '@/providers/AppProviders';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'TravelOS',
  description: 'AI-Powered Travel Industry Super-App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

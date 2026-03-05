import type { Metadata } from 'next';
import { AppProviders } from '@/providers/AppProviders';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TravelOS — AI Travel Super-App',
    template: '%s | TravelOS',
  },
  description: 'AI-Powered Travel Industry Super-App — v4.0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

/**
 * @file src/app/(auth)/login/page.tsx
 *
 * Login page — Next.js 14 App Router.
 * Metadata lives here (server component); redirect logic is in LoginPageContent.
 */

import type { Metadata } from 'next';
import { LoginPageContent } from './LoginPageContent';

export const metadata: Metadata = {
  title: 'Sign in — TravelOS',
  description: 'Sign in to your TravelOS account.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginPageContent />;
}

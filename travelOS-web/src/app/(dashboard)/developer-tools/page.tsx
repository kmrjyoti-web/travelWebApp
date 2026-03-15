'use client';

import { redirect } from 'next/navigation';
import { DevToolsPage } from '@/features/developer-tools';

export default function DeveloperToolsRoute() {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/dashboard');
  }

  return <DevToolsPage />;
}

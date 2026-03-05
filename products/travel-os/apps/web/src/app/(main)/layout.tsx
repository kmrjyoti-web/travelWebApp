'use client';

import { LayoutProvider } from '@/layouts/LayoutProvider';

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialLayout="default">
      {children}
    </LayoutProvider>
  );
}

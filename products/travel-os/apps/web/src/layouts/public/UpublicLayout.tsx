'use client';

import { LayoutProvider } from '../LayoutProvider';

export function UpublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialLayout="public">
      <div className="tos-layout tos-layout--public">
        {children}
      </div>
    </LayoutProvider>
  );
}

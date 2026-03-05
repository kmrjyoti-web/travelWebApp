'use client';

import { LayoutProvider } from '../LayoutProvider';

export function UminimalLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialLayout="minimal">
      <div className="tos-layout tos-layout--minimal">
        {children}
      </div>
    </LayoutProvider>
  );
}

'use client';

import { LayoutProvider } from '../LayoutProvider';

export function UadminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialLayout="admin">
      <div className="tos-layout tos-layout--admin">
        {children}
      </div>
    </LayoutProvider>
  );
}

'use client';

import { LayoutProvider } from '../LayoutProvider';

export function UauthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialLayout="auth">
      <div className="tos-layout tos-layout--auth">
        {children}
      </div>
    </LayoutProvider>
  );
}

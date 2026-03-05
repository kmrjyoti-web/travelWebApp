'use client';
import React from 'react';

export function MinimalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tos-layout tos-layout--minimal">
      <div className="tos-layout__bg" />
      <div className="tos-layout__content">
        <main className="tos-layout__main">{children}</main>
      </div>
    </div>
  );
}

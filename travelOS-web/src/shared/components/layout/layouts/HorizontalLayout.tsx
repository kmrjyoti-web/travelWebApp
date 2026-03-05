'use client';
import React from 'react';
import { HorizontalHeader } from '../headers/HorizontalHeader';
import { DefaultFooter } from '../footers/DefaultFooter';
import { ThemeSettings } from '../theme/ThemeSettings';

export function HorizontalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tos-layout tos-layout--horizontal">
      <div className="tos-layout__bg" />
      <div className="tos-layout__content">
        <HorizontalHeader />
        <main className="tos-layout__main">{children}</main>
        <DefaultFooter />
      </div>
      <ThemeSettings />
    </div>
  );
}

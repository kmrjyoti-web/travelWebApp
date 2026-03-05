'use client';
import React from 'react';
import { useUIStore } from '@/shared/stores/ui.store';
import { DefaultHeader } from '../headers/DefaultHeader';
import { DefaultSidebar } from '../sidebars/DefaultSidebar';
import { DefaultFooter } from '../footers/DefaultFooter';
import { ThemeSettings } from '../theme/ThemeSettings';

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { sidebarPosition } = useUIStore();

  return (
    <div className="tos-layout tos-layout--default">
      <div className="tos-layout__bg" />
      <div className="tos-layout__content">
        <DefaultHeader />
        <div className={`tos-layout__body ${sidebarPosition === 'right' ? 'tos-layout__body--rtl' : ''}`}>
          <DefaultSidebar />
          <main className="tos-layout__main">{children}</main>
        </div>
        <DefaultFooter />
      </div>
      <ThemeSettings />
    </div>
  );
}

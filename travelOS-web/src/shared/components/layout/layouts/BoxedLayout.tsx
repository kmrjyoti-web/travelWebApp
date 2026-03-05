'use client';
import React from 'react';
import { DefaultHeader } from '../headers/DefaultHeader';
import { DefaultSidebar } from '../sidebars/DefaultSidebar';
import { DefaultFooter } from '../footers/DefaultFooter';
import { ThemeSettings } from '../theme/ThemeSettings';

export function BoxedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tos-layout tos-layout--boxed">
      <div className="tos-layout__bg" />
      <div className="tos-layout__content">
        <DefaultHeader />
        <div className="tos-layout__body">
          <DefaultSidebar />
          <main className="tos-layout__main">{children}</main>
        </div>
        <DefaultFooter />
      </div>
      <ThemeSettings />
    </div>
  );
}

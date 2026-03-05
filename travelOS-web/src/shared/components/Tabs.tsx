'use client';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import type { ComponentProps } from 'react';

// Re-export polymorphic components directly
export const Tabs = (props: ComponentProps<typeof CNav>) => <CNav variant="tabs" {...props} />;
Tabs.displayName = 'Tabs';

export const TabItem = CNavItem;
export const TabLink = CNavLink;
export const TabContent = CTabContent;
export const TabPane = CTabPane;

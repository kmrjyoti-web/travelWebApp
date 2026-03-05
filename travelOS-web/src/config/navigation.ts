import type { IconName } from '@/shared/components/Icon';

export interface NavItem {
  label: string;
  icon?: IconName;
  href?: string;
  children?: NavItem[];
}

// Adapted from UI-KIT Sidebar.tsx MENU_DATA (lines 36-74)
export const NAVIGATION: NavItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
  {
    label: 'Master',
    icon: 'Database',
    children: [
      { label: 'Accounts Master', href: '/master/accounts' },
      { label: 'Inventory Master', href: '/master/inventory' },
      { label: 'Rate Master', href: '/master/rate' },
      { label: 'Discount Master', href: '/master/discount' },
      { label: 'Opening Balance', href: '/master/opening-balance' },
      { label: 'Sales Promotions', href: '/master/promotions' },
      { label: 'Currency', href: '/master/currency' },
      {
        label: 'Other Master',
        children: [{ label: 'Station', href: '/master/station' }],
      },
    ],
  },
  { label: 'Itinerary', icon: 'Map', href: '/itinerary' },
  { label: 'Booking', icon: 'BookOpen', href: '/booking' },
  { label: 'DMC', icon: 'Building', href: '/dmc' },
  { label: 'Agent', icon: 'Users', href: '/agent' },
  { label: 'Marketplace', icon: 'ShoppingBag', href: '/marketplace' },
  { label: 'AI Assistant', icon: 'Bot', href: '/ai' },
  { label: 'Analytics', icon: 'ChartBar', href: '/analytics' },
  { label: 'Influencer', icon: 'Star', href: '/influencer' },
  { label: 'Services', icon: 'Briefcase', href: '/services' },
  {
    label: 'Settings',
    icon: 'Settings',
    children: [
      { label: 'Profile', href: '/settings/profile' },
      { label: 'Security', href: '/settings/security' },
      { label: 'Notifications', href: '/settings/notifications' },
    ],
  },
];

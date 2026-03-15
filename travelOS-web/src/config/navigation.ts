import type { IconName } from '@/shared/components/Icon';

export interface NavItem {
  label: string;
  icon?: IconName;
  href?: string;
  children?: NavItem[];
}

// Dev-only nav items (only shown when NODE_ENV === 'development')
const DEV_NAV: NavItem[] =
  process.env.NODE_ENV === 'development'
    ? [{ label: 'Developer Tools', icon: 'Code', href: '/developer-tools' }]
    : [];

// Adapted from UI-KIT Sidebar.tsx MENU_DATA (lines 36-74)
export const NAVIGATION: NavItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
  {
    label: 'Master',
    icon: 'Database',
    children: [
      { label: 'Accounts Master', icon: 'Landmark', href: '/master/accounts' },
      { label: 'Inventory Master', icon: 'Package', href: '/master/inventory' },
      { label: 'Rate Master', icon: 'Tag', href: '/master/rate' },
      { label: 'Discount Master', icon: 'Percent', href: '/master/discount' },
      { label: 'Opening Balance', icon: 'Wallet', href: '/master/opening-balance' },
      { label: 'Sales Promotions', icon: 'Gift', href: '/master/promotions' },
      { label: 'Currency', icon: 'DollarSign', href: '/master/currency' },
      {
        label: 'Other Master',
        icon: 'FolderOpen',
        children: [{ label: 'Station', icon: 'MapPin', href: '/master/station' }],
      },
    ],
  },
  {
    label: 'Itinerary',
    icon: 'Map',
    children: [
      { label: 'Dashboard',        icon: 'LayoutDashboard', href: '/itinerary' },
      { label: 'Itinerary Hub',    icon: 'Compass',         href: '/itinerary/hub' },
      { label: 'My Itinerary',     icon: 'BookMarked',      href: '/itinerary/my' },
      { label: 'Archive Itinerary',icon: 'Archive',         href: '/itinerary/archive' },
    ],
  },
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
      { label: 'Profile', icon: 'User', href: '/settings/profile' },
      { label: 'Security', icon: 'Shield', href: '/settings/security' },
      { label: 'Notifications', icon: 'Bell', href: '/settings/notifications' },
      { label: 'API Integrations', icon: 'Plug', href: '/settings/api-config' },
    ],
  },
  ...DEV_NAV,
];

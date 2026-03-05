// ─── Dashboard mock data ───────────────────────────────────────────────────────
// Extracted from DashboardPage.tsx for tree-shaking and reuse.

export type Region = 'World' | 'India' | 'Other';

export const REGION_OPTIONS: Region[] = ['World', 'India', 'Other'];

export const chartTooltipStyle = {
  borderRadius: 8,
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  backgroundColor: 'var(--tos-surface-card)',
  color: 'var(--tos-text-primary)',
} as const;

export const searchMarketplaceData = [
  { name: 'Bali',       searches: 4500 },
  { name: 'Maldives',   searches: 3800 },
  { name: 'Dubai',      searches: 3200 },
  { name: 'Paris',      searches: 2900 },
  { name: 'Swiss Alps', searches: 2500 },
  { name: 'Tokyo',      searches: 2100 },
  { name: 'Phuket',     searches: 1800 },
  { name: 'Santorini',  searches: 1500 },
  { name: 'Rome',       searches: 1200 },
  { name: 'New York',   searches:  900 },
];

export const searchWebsiteData = [
  { name: 'Kerala',      searches: 5200 },
  { name: 'Goa',         searches: 4800 },
  { name: 'Rajasthan',   searches: 4100 },
  { name: 'Himachal',    searches: 3500 },
  { name: 'Andaman',     searches: 3100 },
  { name: 'Kashmir',     searches: 2800 },
  { name: 'Sikkim',      searches: 2200 },
  { name: 'Uttarakhand', searches: 1900 },
  { name: 'Meghalaya',   searches: 1400 },
  { name: 'Gujarat',     searches: 1100 },
];

export const conversionMarketplaceData = [
  { name: 'Bali',       rate: 12.5, max: 15 },
  { name: 'Dubai',      rate: 10.2, max: 15 },
  { name: 'Maldives',   rate:  9.8, max: 15 },
  { name: 'Paris',      rate:  8.5, max: 15 },
  { name: 'Swiss Alps', rate:  7.2, max: 15 },
];

export const conversionWebsiteData = [
  { name: 'Goa',        rate: 15.4, max: 16 },
  { name: 'Kerala',     rate: 14.2, max: 16 },
  { name: 'Rajasthan',  rate: 11.8, max: 16 },
  { name: 'Andaman',    rate: 10.5, max: 16 },
  { name: 'Himachal',   rate:  9.1, max: 16 },
];

export const trendingSearchData: Record<Region, Array<{ month: string; value: number }>> = {
  World: [
    { month: 'Jan', value: 4000 }, { month: 'Feb', value: 3000 }, { month: 'Mar', value: 5000 },
    { month: 'Apr', value: 4500 }, { month: 'May', value: 6000 }, { month: 'Jun', value: 7000 },
  ],
  India: [
    { month: 'Jan', value: 2000 }, { month: 'Feb', value: 2500 }, { month: 'Mar', value: 3500 },
    { month: 'Apr', value: 3000 }, { month: 'May', value: 4500 }, { month: 'Jun', value: 5000 },
  ],
  Other: [
    { month: 'Jan', value: 1000 }, { month: 'Feb', value: 1200 }, { month: 'Mar', value: 1500 },
    { month: 'Apr', value: 1800 }, { month: 'May', value: 2000 }, { month: 'Jun', value: 2200 },
  ],
};

export const trendingVisitData: Record<Region, Array<{ month: string; value: number }>> = {
  World: [
    { month: 'Jan', value: 2000 }, { month: 'Feb', value: 1500 }, { month: 'Mar', value: 2500 },
    { month: 'Apr', value: 2200 }, { month: 'May', value: 3000 }, { month: 'Jun', value: 3500 },
  ],
  India: [
    { month: 'Jan', value: 1000 }, { month: 'Feb', value: 1200 }, { month: 'Mar', value: 1800 },
    { month: 'Apr', value: 1500 }, { month: 'May', value: 2200 }, { month: 'Jun', value: 2500 },
  ],
  Other: [
    { month: 'Jan', value: 500 }, { month: 'Feb', value: 600 }, { month: 'Mar', value: 750 },
    { month: 'Apr', value: 900 }, { month: 'May', value: 1000 }, { month: 'Jun', value: 1100 },
  ],
};

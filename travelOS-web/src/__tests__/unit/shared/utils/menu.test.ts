import { describe, it, expect } from 'vitest';
import { filterMenu, flattenMenu } from '@/shared/utils/menu';
import type { NavItem } from '@/config/navigation';

const MOCK_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
  {
    label: 'Master',
    icon: 'Database',
    children: [
      { label: 'Accounts Master', href: '/master/accounts' },
      { label: 'Rate Master', href: '/master/rate' },
    ],
  },
  { label: 'Booking', icon: 'BookOpen', href: '/booking' },
];

describe('filterMenu', () => {
  it('returns all items when query is empty', () => {
    expect(filterMenu(MOCK_NAV, '')).toEqual(MOCK_NAV);
  });

  it('filters leaf items matching query', () => {
    const result = filterMenu(MOCK_NAV, 'booking');
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Booking');
  });

  it('returns parent with matching children', () => {
    const result = filterMenu(MOCK_NAV, 'accounts');
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Master');
    expect(result[0].children).toHaveLength(1);
  });

  it('is case-insensitive', () => {
    const result = filterMenu(MOCK_NAV, 'DASHBOARD');
    expect(result).toHaveLength(1);
  });
});

describe('flattenMenu', () => {
  it('flattens nested items with href', () => {
    const flat = flattenMenu(MOCK_NAV);
    expect(flat.length).toBeGreaterThan(2);
    expect(flat.every((i) => i.href)).toBe(true);
  });
});

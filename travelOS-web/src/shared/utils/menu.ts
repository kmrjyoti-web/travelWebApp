import type { NavItem } from '@/config/navigation';

// Adapted from UI-KIT Sidebar.tsx filterMenu function
export function filterMenu(items: NavItem[], query: string): NavItem[] {
  if (!query.trim()) return items;
  const lower = query.toLowerCase();

  return items.reduce<NavItem[]>((acc, item) => {
    if (item.children) {
      const filtered = filterMenu(item.children, query);
      if (filtered.length > 0) {
        acc.push({ ...item, children: filtered });
      } else if (item.label.toLowerCase().includes(lower)) {
        acc.push(item);
      }
    } else if (item.label.toLowerCase().includes(lower)) {
      acc.push(item);
    }
    return acc;
  }, []);
}

export function flattenMenu(items: NavItem[]): NavItem[] {
  return items.reduce<NavItem[]>((acc, item) => {
    if (item.href) acc.push(item);
    if (item.children) acc.push(...flattenMenu(item.children));
    return acc;
  }, []);
}

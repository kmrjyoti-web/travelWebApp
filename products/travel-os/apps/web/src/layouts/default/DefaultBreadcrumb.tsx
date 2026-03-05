'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/icons/Icon';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a URL segment to a human-readable label.
 * 'my-itineraries' → 'My Itineraries'
 * '123abc' → '123abc' (IDs left as-is)
 */
function formatSegment(segment: string): string {
  // If the segment looks like an ID (all hex/digits), return as-is
  if (/^[0-9a-f-]{8,}$/i.test(segment)) return segment;
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

/** Build breadcrumb items from a pathname string. */
export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);

  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/', isLast: segments.length === 0 },
    ...segments.map((segment, index) => ({
      label: formatSegment(segment),
      href: '/' + segments.slice(0, index + 1).join('/'),
      isLast: index === segments.length - 1,
    })),
  ];

  return items;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DefaultBreadcrumb() {
  const pathname = usePathname() ?? '/';
  const items = buildBreadcrumbs(pathname);

  // Don't render on root
  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="tos-breadcrumb">
      <ol className="tos-breadcrumb__list" role="list">
        {items.map((item, index) => (
          <li key={item.href} className="tos-breadcrumb__item">
            {index > 0 && (
              <Icon
                name="ChevronRight"
                size={12}
                className="tos-breadcrumb__separator"
                aria-hidden
              />
            )}

            {item.isLast ? (
              <span
                className="tos-breadcrumb__current"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="tos-breadcrumb__link"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

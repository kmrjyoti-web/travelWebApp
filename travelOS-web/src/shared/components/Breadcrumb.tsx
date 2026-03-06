'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  /** Override auto-generated crumbs from pathname */
  items?: BreadcrumbItem[];
  /** Home link label (default: "Home") */
  homeLabel?: string;
  /** Home link href (default: "/dashboard") */
  homeHref?: string;
  className?: string;
}

/**
 * Auto-generates breadcrumbs from the current pathname, or accepts manual items.
 *
 * @example
 * <Breadcrumb />
 * <Breadcrumb items={[{ label: 'Itineraries', href: '/itineraries' }, { label: 'Edit' }]} />
 */
export function Breadcrumb({ items, homeLabel = 'Home', homeHref = '/dashboard', className = '' }: BreadcrumbProps) {
  const pathname = usePathname();

  const crumbs: BreadcrumbItem[] = items ?? buildFromPath(pathname, homeLabel, homeHref);

  return (
    <nav className={`tos-breadcrumb${className ? ` ${className}` : ''}`} aria-label="Breadcrumb">
      <ol className="tos-breadcrumb__list">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={idx} className="tos-breadcrumb__item" aria-current={isLast ? 'page' : undefined}>
              {!isLast && crumb.href ? (
                <Link href={crumb.href} className="tos-breadcrumb__link">
                  {crumb.label}
                </Link>
              ) : (
                <span className={`tos-breadcrumb__text${isLast ? ' tos-breadcrumb__text--current' : ''}`}>
                  {crumb.label}
                </span>
              )}
              {!isLast && (
                <span className="tos-breadcrumb__sep" aria-hidden>
                  <Icon name="ChevronRight" size={12} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function buildFromPath(pathname: string, homeLabel: string, homeHref: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: homeLabel, href: homeHref }];

  let path = '';
  segments.forEach((seg, idx) => {
    path += `/${seg}`;
    const label = seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = idx === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : path });
  });

  return crumbs;
}

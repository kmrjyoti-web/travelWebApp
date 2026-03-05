'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DefaultHeader } from './DefaultHeader';
import { NAVIGATION } from '@/config/navigation';
import type { NavItem } from '@/config/navigation';
import { Icon } from '@/shared/components/Icon';

function HorizontalMenuItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {item.href && !hasChildren ? (
        <Link href={item.href} className="tos-h-menu__item">
          {item.icon && <Icon name={item.icon} size={14} />}
          {item.label}
        </Link>
      ) : (
        <button type="button" className="tos-h-menu__item">
          {item.icon && <Icon name={item.icon} size={14} />}
          {item.label}
          {hasChildren && <Icon name="ChevronDown" size={12} />}
        </button>
      )}
      {hasChildren && open && (
        <div className="tos-h-menu__dropdown">
          {item.children!.map((child) => (
            <Link
              key={child.label}
              href={child.href || '#'}
              className="tos-nav-item"
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function HorizontalHeader() {
  return (
    <>
      <DefaultHeader />
      <nav className="tos-h-menu">
        {NAVIGATION.map((item) => (
          <HorizontalMenuItem key={item.label} item={item} />
        ))}
      </nav>
    </>
  );
}

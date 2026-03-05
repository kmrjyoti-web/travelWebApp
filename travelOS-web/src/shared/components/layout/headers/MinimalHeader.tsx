'use client';
import React from 'react';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export function MinimalHeader() {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 'var(--tos-spacing-md) var(--tos-spacing-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--tos-spacing-sm)',
          color: '#ffffff',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        <Icon name="Plane" size={22} />
        TravelOS
      </Link>
      <Link
        href="/dashboard"
        style={{
          color: 'rgba(255,255,255,0.75)',
          textDecoration: 'none',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Icon name="ArrowLeft" size={14} />
        Back to App
      </Link>
    </header>
  );
}

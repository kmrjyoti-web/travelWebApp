'use client';
import React from 'react';

export function MinimalFooter() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: 'var(--tos-spacing-md)',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.5)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      &copy; {new Date().getFullYear()} TravelOS. All rights reserved.
    </footer>
  );
}

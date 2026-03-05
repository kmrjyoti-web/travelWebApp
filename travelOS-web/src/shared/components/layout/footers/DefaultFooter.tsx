'use client';
import React from 'react';

export function DefaultFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="tos-footer">
      <span>
        &copy; {year}{' '}
        <a href="https://travelos.ai" target="_blank" rel="noreferrer">
          TravelOS
        </a>
        . All rights reserved.
      </span>
      <span style={{ display: 'flex', gap: 'var(--tos-spacing-md)' }}>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <span style={{ color: 'var(--tos-text-muted)' }}>v4.0.0</span>
      </span>
    </footer>
  );
}

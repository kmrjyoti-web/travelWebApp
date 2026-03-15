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
      <span className="tos-footer__right">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <span className="tos-footer__powered">
          Powered by <strong>TravelOS</strong>
        </span>
      </span>
    </footer>
  );
}

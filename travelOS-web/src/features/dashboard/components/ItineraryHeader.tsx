'use client';
import React from 'react';
import { Icon } from '@/shared/components';

interface ItineraryHeaderProps {
  onSelfClick?: () => void;
  onMarketplaceClick?: () => void;
  onAiClick?: () => void;
}

const BTN_BASE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem', fontWeight: 600,
  borderRadius: '0.75rem', border: 'none',
  cursor: 'pointer', color: '#fff',
};

export default function ItineraryHeader({ onSelfClick, onMarketplaceClick, onAiClick }: ItineraryHeaderProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--cui-body-color, #374151)' }}>
        Itinerary
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--cui-secondary-color, #6b7280)' }}>
          Add Itinerary:
        </span>

        <button type="button" onClick={onSelfClick} style={{ ...BTN_BASE, background: '#2563eb' }}>
          <Icon name="User" size={16} />
          <span>Self</span>
        </button>

        <button type="button" onClick={onMarketplaceClick} style={{ ...BTN_BASE, background: '#059669' }}>
          <Icon name="Store" size={16} />
          <span>Search Marketplace</span>
        </button>

        <button type="button" onClick={onAiClick} style={{ ...BTN_BASE, background: 'linear-gradient(to right, #7c3aed, #4f46e5)' }}>
          <Icon name="Sparkles" size={16} />
          <span>Create With AI</span>
        </button>
      </div>
    </div>
  );
}

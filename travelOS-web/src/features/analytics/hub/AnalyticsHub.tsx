'use client';
import React, { useState } from 'react';
import { PageHeader, TextField } from '@/shared/components';
import { AgentKPIs, RevenueTrend, ConversionFunnel } from '../components';
import type { DateRangeParams } from '@/shared/services/analytics.service';

const PRESETS: { label: string; days: number }[] = [
  { label: '7d',  days: 7  },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0] ?? '';
}

function today(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

export function AnalyticsHub() {
  const [preset, setPreset] = useState(30);
  const [from, setFrom]     = useState('');
  const [to,   setTo]       = useState('');

  // Use custom range if both set, else derive from preset
  const dateRange: DateRangeParams =
    from && to
      ? { fromDate: from, toDate: to }
      : { fromDate: daysAgo(preset), toDate: today() };

  const handlePreset = (days: number) => {
    setPreset(days);
    setFrom('');
    setTo('');
  };

  return (
    <main style={{ padding: '1.5rem' }}>
      <PageHeader
        title="Analytics"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <button
                key={p.days}
                onClick={() => handlePreset(p.days)}
                style={{
                  padding: '0.25rem 0.625rem', borderRadius: '0.375rem', border: '1px solid', fontSize: '0.8125rem', cursor: 'pointer',
                  background:  (!from && !to && preset === p.days) ? 'var(--cui-primary, #1B4F72)' : 'transparent',
                  color:       (!from && !to && preset === p.days) ? '#fff' : 'var(--cui-body-color, #374151)',
                  borderColor: (!from && !to && preset === p.days) ? 'var(--cui-primary, #1B4F72)' : 'var(--cui-border-color, #d1d5db)',
                }}
              >
                {p.label}
              </button>
            ))}
            <TextField
              label="From date"
              variant="outlined"
              size="sm"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="From date"
            />
            <span style={{ color: 'var(--cui-secondary-color, #6b7280)', fontSize: '0.875rem' }}>—</span>
            <TextField
              label="To date"
              variant="outlined"
              size="sm"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="To date"
            />
          </div>
        }
        className="mb-4"
      />

      {/* KPIs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AgentKPIs dateRange={dateRange} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        <RevenueTrend     dateRange={dateRange} />
        <ConversionFunnel dateRange={dateRange} />
      </div>
    </main>
  );
}

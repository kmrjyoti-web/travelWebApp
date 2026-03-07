'use client';
import React, { useState } from 'react';
import { Alert, SelectField } from '@/shared/components';
import { useConversionFunnel } from '../hooks/useAnalytics';
import type { DateRangeParams } from '@/shared/services/analytics.service';

const FUNNEL_OPTIONS = [
  { value: 'booking_create', label: 'Booking Flow' },
  { value: 'checkout',       label: 'Checkout' },
  { value: 'itinerary',      label: 'Itinerary' },
];

const CARD: React.CSSProperties = {
  background: 'var(--cui-body-bg, #fff)',
  padding: '1.5rem',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px rgba(0,0,0,.08)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
};

const BAR_COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

interface ConversionFunnelProps {
  dateRange: DateRangeParams;
}

export function ConversionFunnel({ dateRange }: ConversionFunnelProps) {
  const [funnel, setFunnel] = useState('booking_create');
  const { data, isLoading, error } = useConversionFunnel(funnel, dateRange);

  const steps = data?.steps ?? [];
  const maxCount = steps.length > 0 ? Math.max(...steps.map(s => s.totalCount)) : 1;

  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--cui-body-color, #374151)' }}>
            Conversion Funnel
          </h3>
          {data && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--cui-secondary-color, #6b7280)' }}>
              Overall: {data.overallConversionRate}%
            </p>
          )}
        </div>
        <SelectField
          label="Funnel"
          variant="outlined"
          size="sm"
          value={funnel}
          onChange={(e) => setFunnel(e.target.value)}
        >
          {FUNNEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </SelectField>
      </div>

      {error && <Alert color="danger">Failed to load funnel data.</Alert>}

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cui-secondary-color, #6b7280)' }}>Loading…</div>
      ) : steps.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cui-secondary-color, #6b7280)' }}>No data for selected period.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {steps.map((step, i) => {
            const widthPct = maxCount > 0 ? (step.totalCount / maxCount) * 100 : 0;
            const color    = BAR_COLORS[i % BAR_COLORS.length] ?? '#6366f1';
            return (
              <div key={step.stepName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--cui-body-color, #374151)' }}>
                    {i + 1}. {step.stepName}
                  </span>
                  <span style={{ color: 'var(--cui-secondary-color, #6b7280)' }}>
                    {step.totalCount.toLocaleString()} &nbsp;
                    <span style={{ color, fontWeight: 600 }}>{step.conversionRate}%</span>
                  </span>
                </div>
                <div style={{ height: '0.625rem', background: 'var(--cui-secondary-bg, #f3f4f6)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${widthPct}%`, background: color, borderRadius: '9999px', transition: 'width .4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';
import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
} from 'recharts';
import { Alert } from '@/shared/components';
import { useAgentRevenue } from '../hooks/useAnalytics';
import type { DateRangeParams } from '@/shared/services/analytics.service';

const CARD: React.CSSProperties = {
  background: 'var(--cui-body-bg, #fff)',
  padding: '1.5rem',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px rgba(0,0,0,.08)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
};

const TOOLTIP_STYLE = {
  borderRadius: '0.5rem',
  border: 'none',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
  backgroundColor: 'var(--cui-body-bg, #fff)',
  color: 'var(--cui-body-color, #000)',
};

interface RevenueTrendProps {
  dateRange: DateRangeParams;
}

export function RevenueTrend({ dateRange }: RevenueTrendProps) {
  const { data, isLoading, error } = useAgentRevenue(dateRange);

  if (error) return <Alert color="danger">Failed to load revenue data.</Alert>;

  const entries = data?.entries ?? [];

  const chartData = entries.map(e => ({
    date:       new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    Revenue:    e.revenue,
    Commission: e.commission,
    Bookings:   e.bookings,
  }));

  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--cui-body-color, #374151)' }}>
            Revenue Trend
          </h3>
          {data && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--cui-secondary-color, #6b7280)' }}>
              Total: ₹{data.totalRevenue.toLocaleString()} · Commission: ₹{data.totalCommission.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div style={{ height: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cui-secondary-color, #6b7280)' }}>
          Loading…
        </div>
      ) : chartData.length === 0 ? (
        <div style={{ height: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cui-secondary-color, #6b7280)' }}>
          No data for selected period.
        </div>
      ) : (
        <div style={{ height: '16rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCommission" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '0.8125rem' }} />
              <Area type="monotone" dataKey="Revenue"    stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#gradRevenue)" />
              <Area type="monotone" dataKey="Commission" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#gradCommission)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import { Icon } from '@/components/icons/Icon';
import {
  trendingSearchData, trendingVisitData, REGION_OPTIONS, chartTooltipStyle,
} from '../data/dashboard-data';
import type { Region } from '../data/dashboard-data';

const selectStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: 'var(--tos-radius-md)',
  border: '1px solid var(--tos-border-default)',
  backgroundColor: 'var(--tos-surface-bg)',
  color: 'var(--tos-text-primary)',
  fontSize: 'var(--tos-font-size-sm)',
  outline: 'none',
};

export function DashboardTrendCharts() {
  const [searchRegion, setSearchRegion] = useState<Region>('World');
  const [visitRegion, setVisitRegion] = useState<Region>('World');

  return (
    <section
      aria-label="Trending search and visit data"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--tos-spacing-6)' }}
    >
      <div className="tos-chart-card">
        <div className="tos-chart-card__header">
          <h3 className="tos-chart-card__title">
            <Icon name="Search" size={18} style={{ color: 'rgb(99,102,241)' }} aria-hidden />
            Trending Searches
          </h3>
          <select value={searchRegion} onChange={(e) => setSearchRegion(e.target.value as Region)} aria-label="Select region for trending searches" style={selectStyle}>
            {REGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ height: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendingSearchData[searchRegion]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="rgb(99,102,241)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(99,102,241)" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tos-border-subtle)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--tos-text-secondary)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--tos-text-secondary)', fontSize: 12 }} />
              <RechartsTooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="rgb(99,102,241)" strokeWidth={3} fillOpacity={1} fill="url(#colorSearch)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tos-chart-card">
        <div className="tos-chart-card__header">
          <h3 className="tos-chart-card__title">
            <Icon name="MapPin" size={18} style={{ color: 'rgb(249,115,22)' }} aria-hidden />
            Trending Visits
          </h3>
          <select value={visitRegion} onChange={(e) => setVisitRegion(e.target.value as Region)} aria-label="Select region for trending visits" style={selectStyle}>
            {REGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ height: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendingVisitData[visitRegion]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="rgb(249,115,22)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(249,115,22)" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tos-border-subtle)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--tos-text-secondary)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--tos-text-secondary)', fontSize: 12 }} />
              <RechartsTooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="rgb(249,115,22)" strokeWidth={3} fillOpacity={1} fill="url(#colorVisit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

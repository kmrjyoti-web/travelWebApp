'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import { Icon } from '@/components/icons/Icon';
import {
  searchMarketplaceData, searchWebsiteData, chartTooltipStyle,
} from '../data/dashboard-data';

export function DashboardSearchCharts() {
  return (
    <section
      aria-label="Top 10 destination searches"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--tos-spacing-6)' }}
    >
      <div className="tos-chart-card">
        <div className="tos-chart-card__header">
          <h3 className="tos-chart-card__title">
            <Icon name="Star" size={18} style={{ color: 'rgb(236,72,153)' }} aria-hidden />
            Top 10 Search — Marketplace
          </h3>
        </div>
        <div style={{ height: 288 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={searchMarketplaceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="var(--tos-border-subtle)" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--tos-text-secondary)', fontSize: 12 }} />
              <RechartsTooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="searches" fill="rgb(236,72,153)" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tos-chart-card">
        <div className="tos-chart-card__header">
          <h3 className="tos-chart-card__title">
            <Icon name="Globe" size={18} style={{ color: 'rgb(6,182,212)' }} aria-hidden />
            Top 10 Search — Website
          </h3>
        </div>
        <div style={{ height: 288 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={searchWebsiteData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="var(--tos-border-subtle)" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--tos-text-secondary)', fontSize: 12 }} />
              <RechartsTooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="searches" fill="rgb(6,182,212)" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

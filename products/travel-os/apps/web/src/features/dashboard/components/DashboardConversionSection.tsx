'use client';

import { memo } from 'react';
import { Icon } from '@/components/icons/Icon';
import { conversionMarketplaceData, conversionWebsiteData } from '../data/dashboard-data';

interface ConversionItemProps {
  rank: number;
  name: string;
  rate: number;
  max: number;
  color: string;
}

const ConversionItem = memo(function ConversionItem({ rank, name, rate, max, color }: ConversionItemProps) {
  return (
    <div className="tos-conversion-item">
      <div className="tos-conversion-item__left">
        <span className="tos-conversion-item__rank" aria-hidden>{rank}</span>
        <span className="tos-conversion-item__name">{name}</span>
      </div>
      <div className="tos-conversion-item__right">
        <div className="tos-conversion-item__bar-bg" role="presentation">
          <div
            className="tos-conversion-item__bar-fill"
            style={{ width: `${(rate / max) * 100}%`, backgroundColor: color }}
          />
        </div>
        <span className="tos-conversion-item__rate" style={{ color }} aria-label={`${rate}%`}>
          {rate}%
        </span>
      </div>
    </div>
  );
});

export function DashboardConversionSection() {
  return (
    <section
      aria-label="Top conversion destinations"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--tos-spacing-6)' }}
    >
      <div className="tos-chart-card">
        <div className="tos-chart-card__header">
          <h3 className="tos-chart-card__title">
            <Icon name="TrendingUp" size={18} style={{ color: 'rgb(16,185,129)' }} aria-hidden />
            Top Conversions — Marketplace
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tos-spacing-2)' }}>
          {conversionMarketplaceData.map((item, idx) => (
            <ConversionItem key={item.name} rank={idx + 1} name={item.name} rate={item.rate} max={item.max} color="rgb(16,185,129)" />
          ))}
        </div>
      </div>

      <div className="tos-chart-card">
        <div className="tos-chart-card__header">
          <h3 className="tos-chart-card__title">
            <Icon name="TrendingUp" size={18} style={{ color: 'rgb(59,130,246)' }} aria-hidden />
            Top Conversions — Website
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tos-spacing-2)' }}>
          {conversionWebsiteData.map((item, idx) => (
            <ConversionItem key={item.name} rank={idx + 1} name={item.name} rate={item.rate} max={item.max} color="rgb(59,130,246)" />
          ))}
        </div>
      </div>
    </section>
  );
}

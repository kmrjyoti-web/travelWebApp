'use client';

import { memo } from 'react';
import { Icon } from '@/components/icons/Icon';
import type { IconProps } from '@/components/icons/Icon';

interface KpiCardProps {
  title: string;
  value: string;
  icon: IconProps['name'];
  iconStyle: React.CSSProperties;
}

const KpiCard = memo(function KpiCard({ title, value, icon, iconStyle }: KpiCardProps) {
  return (
    <div className="tos-kpi-card">
      <div className="tos-kpi-card__icon" style={iconStyle}>
        <Icon name={icon} size={24} aria-hidden />
      </div>
      <div>
        <p className="tos-kpi-card__label">{title}</p>
        <p className="tos-kpi-card__value">{value}</p>
      </div>
    </div>
  );
});

const KPI_CARDS: KpiCardProps[] = [
  { title: 'Total Itineraries', value: '12,450', icon: 'Map',       iconStyle: { backgroundColor: 'rgba(59,130,246,0.12)',  color: 'rgb(59,130,246)'  } },
  { title: 'My Itineraries',    value: '142',    icon: 'Globe',     iconStyle: { backgroundColor: 'rgba(16,185,129,0.12)',  color: 'rgb(16,185,129)'  } },
  { title: 'Downloaded',        value: '3,890',  icon: 'Download',  iconStyle: { backgroundColor: 'rgba(245,158,11,0.12)',  color: 'rgb(245,158,11)'  } },
  { title: 'AI Generated',      value: '8,210',  icon: 'Sparkles',  iconStyle: { backgroundColor: 'rgba(139,92,246,0.12)',  color: 'rgb(139,92,246)'  } },
  { title: 'Marketplace',       value: '5,120',  icon: 'Star',      iconStyle: { backgroundColor: 'rgba(236,72,153,0.12)',  color: 'rgb(236,72,153)'  } },
  { title: 'Website',           value: '4,830',  icon: 'Globe',     iconStyle: { backgroundColor: 'rgba(6,182,212,0.12)',   color: 'rgb(6,182,212)'   } },
  { title: 'Both (Mkt & Web)',  value: '2,500',  icon: 'Map',       iconStyle: { backgroundColor: 'rgba(99,102,241,0.12)',  color: 'rgb(99,102,241)'  } },
  { title: 'Conversion Rate',   value: '14.2%',  icon: 'TrendingUp',iconStyle: { backgroundColor: 'rgba(244,63,94,0.12)',   color: 'rgb(244,63,94)'   } },
];

export function DashboardKpiSection() {
  return (
    <section
      aria-label="Key performance indicators"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--tos-spacing-4)',
      }}
    >
      {KPI_CARDS.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </section>
  );
}

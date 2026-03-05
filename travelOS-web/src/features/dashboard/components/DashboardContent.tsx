'use client';

import React from 'react';
import { AiItineraryGenerator } from './AiItineraryGenerator';
import { KpiCard } from './KpiCard';
import { TopSearchChart } from './TopSearchChart';
import type { KpiCardProps } from './KpiCard';
import type { TopSearchItem } from './TopSearchChart';
import '../dashboard.css';

const KPI_DATA: KpiCardProps[] = [
  {
    label: 'Total Itineraries',
    value: '12,450',
    icon: 'Map',
    iconBg: '#eef2ff',
    iconColor: '#4f46e5',
  },
  {
    label: 'My Itineraries',
    value: '142',
    icon: 'Globe',
    iconBg: '#ecfdf5',
    iconColor: '#059669',
  },
  {
    label: 'Downloaded',
    value: '3,890',
    icon: 'Download',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    label: 'AI Generated',
    value: '8,210',
    icon: 'Sparkles',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    label: 'Marketplace',
    value: '5,120',
    icon: 'Star',
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
  },
  {
    label: 'Website',
    value: '4,830',
    icon: 'Monitor',
    iconBg: '#e0f2fe',
    iconColor: '#0284c7',
  },
  {
    label: 'Both (Met & Web)',
    value: '2,500',
    icon: 'LayoutGrid',
    iconBg: '#f3e8ff',
    iconColor: '#7c3aed',
  },
  {
    label: 'Conversion Rate',
    value: '14.2%',
    icon: 'TrendingUp',
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
  },
];

const MARKETPLACE_SEARCH: TopSearchItem[] = [
  { name: 'Bali', value: 1850 },
  { name: 'Maldives', value: 1620 },
  { name: 'Dubai', value: 1480 },
  { name: 'Paris', value: 1320 },
  { name: 'Swiss Alps', value: 1100 },
  { name: 'Tokyo', value: 980 },
  { name: 'Phuket', value: 870 },
  { name: 'Santorini', value: 760 },
  { name: 'Rome', value: 650 },
  { name: 'New York', value: 540 },
];

const WEBSITE_SEARCH: TopSearchItem[] = [
  { name: 'Kerala', value: 2100 },
  { name: 'Goa', value: 1950 },
  { name: 'Rajasthan', value: 1700 },
  { name: 'Himachal', value: 1550 },
  { name: 'Andaman', value: 1400 },
  { name: 'Kashmir', value: 1300 },
  { name: 'Sikkim', value: 1150 },
  { name: 'Uttarakhand', value: 1050 },
  { name: 'Meghalaya', value: 900 },
  { name: 'Gujarat', value: 800 },
];

export const DashboardContent: React.FC = () => {
  return (
    <div>
      <AiItineraryGenerator />

      <section aria-label="Key Performance Indicators">
        <div className="tos-kpi-row">
          {KPI_DATA.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </section>

      <section aria-label="Search Analytics">
        <div className="tos-chart-row">
          <TopSearchChart
            title="Top 10 Search → Marketplace"
            icon="ShoppingBag"
            iconColor="#e91e90"
            data={MARKETPLACE_SEARCH}
            barColor="#e91e90"
          />
          <TopSearchChart
            title="Top 10 Search → Website"
            icon="Globe"
            iconColor="#06b6d4"
            data={WEBSITE_SEARCH}
            barColor="#06b6d4"
          />
        </div>
      </section>
    </div>
  );
};

DashboardContent.displayName = 'DashboardContent';

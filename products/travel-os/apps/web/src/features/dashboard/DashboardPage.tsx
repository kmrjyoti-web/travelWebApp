'use client';

/**
 * @file src/features/dashboard/DashboardPage.tsx
 *
 * Dashboard orchestrator — Phase 9.1 optimization:
 *   - Mock data extracted to data/dashboard-data.ts
 *   - Chart-heavy sections lazy-loaded via next/dynamic (ssr:false)
 *   - Static sections (AI prompt, KPIs, conversions) imported directly
 *   - React.memo applied to pure sub-components (KpiCard, ConversionItem)
 */

import dynamic from 'next/dynamic';
import { DashboardAiPrompt } from './components/DashboardAiPrompt';
import { DashboardKpiSection } from './components/DashboardKpiSection';
import { DashboardConversionSection } from './components/DashboardConversionSection';

// Recharts is ~300KB — lazy-load to keep initial bundle lean.
const DashboardSearchCharts = dynamic(
  () => import('./components/DashboardSearchCharts').then((m) => ({ default: m.DashboardSearchCharts })),
  { ssr: false, loading: () => <div className="tos-chart-skeleton" aria-busy="true" aria-label="Loading charts" /> },
);

const DashboardTrendCharts = dynamic(
  () => import('./components/DashboardTrendCharts').then((m) => ({ default: m.DashboardTrendCharts })),
  { ssr: false, loading: () => <div className="tos-chart-skeleton" aria-busy="true" aria-label="Loading charts" /> },
);

export function DashboardPage() {
  return (
    <div className="tos-dashboard">
      <DashboardAiPrompt />
      <DashboardKpiSection />
      <DashboardSearchCharts />
      <DashboardConversionSection />
      <DashboardTrendCharts />
    </div>
  );
}

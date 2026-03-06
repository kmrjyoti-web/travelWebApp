'use client';
import React from 'react';
import { StatCard, Alert } from '@/shared/components';
import { useAgentDashboard } from '../hooks/useAnalytics';
import type { DateRangeParams } from '@/shared/services/analytics.service';

function fmt(n: number) {
  if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

interface AgentKPIsProps {
  dateRange: DateRangeParams;
}

export function AgentKPIs({ dateRange }: AgentKPIsProps) {
  const { data, isLoading, error } = useAgentDashboard(dateRange);

  if (error) return <Alert color="danger">Failed to load dashboard metrics.</Alert>;

  const d = data;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
      <StatCard
        title="Total Bookings"
        value={isLoading ? '—' : (d?.totalBookings ?? 0)}
        icon="BookOpen"
        iconColor="#3b82f6"
      />
      <StatCard
        title="Confirmed"
        value={isLoading ? '—' : (d?.confirmedBookings ?? 0)}
        icon="CircleCheck"
        iconColor="#10b981"
      />
      <StatCard
        title="Cancelled"
        value={isLoading ? '—' : (d?.cancelledBookings ?? 0)}
        icon="CircleX"
        iconColor="#ef4444"
      />
      <StatCard
        title="Revenue"
        value={isLoading ? '—' : fmt(d?.totalRevenue ?? 0)}
        icon="TrendingUp"
        iconColor="#6366f1"
      />
      <StatCard
        title="Commission"
        value={isLoading ? '—' : fmt(d?.totalCommission ?? 0)}
        icon="IndianRupee"
        iconColor="#f59e0b"
      />
      <StatCard
        title="Avg Booking"
        value={isLoading ? '—' : fmt(d?.avgBookingValue ?? 0)}
        icon="ChartBar"
        iconColor="#06b6d4"
      />
      <StatCard
        title="Conversion"
        value={isLoading ? '—' : `${d?.conversionRate ?? 0}%`}
        icon="Percent"
        iconColor="#a855f7"
      />
    </div>
  );
}

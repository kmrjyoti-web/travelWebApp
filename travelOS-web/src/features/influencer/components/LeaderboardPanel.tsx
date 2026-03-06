'use client';
import React, { useState } from 'react';
import { DataTable, Alert } from '@/shared/components';
import { useLeaderboard } from '../hooks/useInfluencer';
import type { LeaderboardEntry, LeaderboardPeriod } from '@/shared/services/influencer.service';

type LeaderboardRow = LeaderboardEntry & Record<string, unknown>;

const PERIOD_OPTIONS: { label: string; value: LeaderboardPeriod }[] = [
  { label: 'Weekly',   value: 'weekly'   },
  { label: 'Monthly',  value: 'monthly'  },
  { label: 'Yearly',   value: 'yearly'   },
  { label: 'All Time', value: 'all_time' },
];

function currentPeriodKey(period: LeaderboardPeriod): string {
  const now = new Date();
  if (period === 'weekly') {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    return start.toISOString().split('T')[0] ?? '';
  }
  if (period === 'monthly')  return now.toISOString().slice(0, 7);
  if (period === 'yearly')   return String(now.getFullYear());
  return 'all';
}

const BTN_BASE: React.CSSProperties = {
  padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '1px solid',
  fontSize: '0.8125rem', cursor: 'pointer',
};

export function LeaderboardPanel() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('monthly');
  const [page, setPage]     = useState(1);
  const periodKey = currentPeriodKey(period);

  const { data, isLoading, error } = useLeaderboard(period, periodKey, page);

  if (error) return <Alert color="danger">Failed to load leaderboard.</Alert>;

  const rows = ((data?.items ?? []) as LeaderboardRow[]);

  const columns = [
    {
      key: 'rank', label: 'Rank',
      render: (v: unknown) => {
        const rank = v as number;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
        return (
          <span style={{ fontWeight: 700, color: 'var(--cui-body-color)' }}>
            {medal ? `${medal} ` : ''}{rank}
          </span>
        );
      },
    },
    { key: 'influencerId', label: 'Influencer ID', render: (v: unknown) => <code style={{ fontSize: '0.8125rem' }}>{(v as string).slice(0, 8)}…</code> },
    { key: 'totalBookings', label: 'Bookings',     render: (v: unknown) => (v as number).toLocaleString() },
    {
      key: 'totalEarnings', label: 'Earnings',
      render: (v: unknown) => {
        const n = v as number;
        const s = n >= 1_000_000 ? `₹${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `₹${(n / 1_000).toFixed(0)}K` : `₹${n}`;
        return <strong style={{ color: '#10b981' }}>{s}</strong>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Period selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setPeriod(opt.value); setPage(1); }}
            style={{
              ...BTN_BASE,
              background:  period === opt.value ? 'var(--cui-primary, #1B4F72)' : 'transparent',
              color:       period === opt.value ? '#fff' : 'var(--cui-body-color)',
              borderColor: period === opt.value ? 'var(--cui-primary, #1B4F72)' : 'var(--cui-border-color, #d1d5db)',
            }}
          >
            {opt.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--cui-secondary-color)', alignSelf: 'center' }}>
          Period: <strong>{periodKey}</strong>
        </span>
      </div>

      <DataTable<LeaderboardRow>
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyTitle="No leaderboard data"
        emptyDescription="No data available for this period."
      />

      {/* Pagination */}
      {(data?.total ?? 0) > (data?.limit ?? 20) && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={BTN_BASE}>‹ Prev</button>
          <span style={{ alignSelf: 'center', fontSize: '0.875rem', color: 'var(--cui-secondary-color)' }}>
            Page {data?.page} / {Math.ceil((data?.total ?? 0) / (data?.limit ?? 20))}
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={(data?.page ?? 1) * (data?.limit ?? 20) >= (data?.total ?? 0)} style={BTN_BASE}>Next ›</button>
        </div>
      )}
    </div>
  );
}

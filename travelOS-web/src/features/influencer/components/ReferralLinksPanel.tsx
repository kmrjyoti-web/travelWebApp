'use client';
import React, { useState } from 'react';
import { DataTable, StatCard, Alert, Button } from '@/shared/components';
import { useReferralLinkStats, useGenerateReferralLink } from '../hooks/useInfluencer';
import type { ReferralLink } from '@/shared/services/influencer.service';

type LinkRow = ReferralLink & Record<string, unknown>;

const FIELD: React.CSSProperties = {
  flex: '1 1 180px',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--cui-border-color, #d1d5db)',
  fontSize: '0.875rem',
  color: 'var(--cui-body-color)',
  background: 'var(--cui-body-bg, #fff)',
};

interface ReferralLinksPanelProps {
  influencerId: string;
}

export function ReferralLinksPanel({ influencerId }: ReferralLinksPanelProps) {
  const { data, isLoading, error, refetch } = useReferralLinkStats(influencerId);
  const [targetUrl, setTargetUrl] = useState('');
  const [listingId, setListingId] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { mutate: generate, isPending: generating } = useGenerateReferralLink(influencerId, {
    onSuccess: () => {
      setTargetUrl('');
      setListingId('');
      setShowForm(false);
      refetch();
    },
  });

  if (error) return <Alert color="danger">Failed to load referral links.</Alert>;

  const rows = ((data?.links ?? []) as LinkRow[]);

  const columns = [
    { key: 'refCode',      label: 'Ref Code',  render: (v: unknown) => <code style={{ fontSize: '0.8125rem', background: 'var(--cui-light, #f3f4f6)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>{v as string}</code> },
    { key: 'targetUrl',    label: 'Target URL', render: (v: unknown) => <span style={{ fontSize: '0.8125rem', color: 'var(--cui-secondary-color)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{v as string}</span> },
    { key: 'clickCount',   label: 'Clicks',     render: (v: unknown) => (v as number).toLocaleString() },
    { key: 'bookingCount', label: 'Bookings',   render: (v: unknown) => (v as number).toLocaleString() },
    {
      key: 'isActive', label: 'Status',
      render: (v: unknown) => (
        <span style={{ padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
          background: v ? '#dcfce7' : '#fee2e2', color: v ? '#065f46' : '#991b1b' }}>
          {v ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Created', render: (v: unknown) => new Date(v as string).toLocaleDateString('en-IN') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <StatCard title="Total Links"    value={isLoading ? '—' : (data?.links.length ?? 0)}       icon="Link"    iconColor="#6366f1" />
        <StatCard title="Total Clicks"   value={isLoading ? '—' : (data?.totalClicks ?? 0)}         icon="MousePointer" iconColor="#3b82f6" />
        <StatCard title="Total Bookings" value={isLoading ? '—' : (data?.totalBookings ?? 0)}       icon="BookOpen" iconColor="#10b981" />
      </div>

      {/* Generate Form */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button color="primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'New Referral Link'}
        </Button>
      </div>

      {showForm && (
        <div style={{
          background: 'var(--cui-card-bg, #fff)',
          border: '1px solid var(--cui-border-color)',
          borderRadius: '0.5rem',
          padding: '1rem',
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end',
        }}>
          <div style={{ flex: '2 1 240px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cui-secondary-color)', marginBottom: '0.25rem' }}>
              Target URL *
            </label>
            <input style={FIELD} placeholder="https://example.com/package" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cui-secondary-color)', marginBottom: '0.25rem' }}>
              Listing ID (optional)
            </label>
            <input style={FIELD} placeholder="listing-uuid" value={listingId} onChange={(e) => setListingId(e.target.value)} />
          </div>
          <Button
            color="success"
            disabled={!targetUrl || generating}
            onClick={() => generate({ targetUrl, ...(listingId ? { listingId } : {}) })}
          >
            {generating ? 'Generating…' : 'Generate'}
          </Button>
        </div>
      )}

      <DataTable<LinkRow>
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyTitle="No referral links yet"
        emptyDescription="Generate your first referral link above."
      />
    </div>
  );
}

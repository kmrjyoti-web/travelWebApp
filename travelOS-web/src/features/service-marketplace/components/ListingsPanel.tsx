'use client';
import React, { useState } from 'react';
import { DataTable, Alert, Button } from '@/shared/components';
import { useServiceListings, usePublishListing } from '../hooks/useServiceMarketplace';
import type { ServiceListing, ServiceListingStatus } from '@/shared/services/service-marketplace.service';

type ListingRow = ServiceListing & Record<string, unknown>;

const STATUS_COLORS: Record<ServiceListingStatus, { bg: string; text: string }> = {
  draft:     { bg: '#fef3c7', text: '#92400e' },
  published: { bg: '#dcfce7', text: '#065f46' },
  archived:  { bg: '#f3f4f6', text: '#6b7280' },
};

const FILTER_BTN = (active: boolean): React.CSSProperties => ({
  padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '1px solid', fontSize: '0.8125rem', cursor: 'pointer',
  background:  active ? 'var(--cui-primary, #1B4F72)' : 'transparent',
  color:       active ? '#fff' : 'var(--cui-body-color)',
  borderColor: active ? 'var(--cui-primary, #1B4F72)' : 'var(--cui-border-color, #d1d5db)',
});

const SERVICE_TYPES = ['All', 'visa', 'guide', 'photographer', 'transfer', 'insurance', 'religious'];

interface ListingsPanelProps {
  onCreateNew: () => void;
  onView: (id: string) => void;
}

export function ListingsPanel({ onCreateNew, onView }: ListingsPanelProps) {
  const [serviceType, setServiceType] = useState('');
  const [destination, setDestination] = useState('');
  const [page, setPage]               = useState(1);

  const { data, isLoading, error, refetch } = useServiceListings({
    ...(serviceType ? { serviceType } : {}),
    ...(destination ? { destination } : {}),
    page,
  });

  const { mutate: publish, isPending: publishing } = usePublishListing({ onSuccess: () => refetch() });

  if (error) return <Alert color="danger">Failed to load service listings.</Alert>;

  type ListingRow = ServiceListing & Record<string, unknown>;
  const rows = (data?.items ?? []) as ListingRow[];

  const columns = [
    { key: 'serviceType', label: 'Type',    render: (v: unknown) => <span style={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}>{v as string}</span> },
    { key: 'title',       label: 'Title',   render: (v: unknown) => <strong style={{ color: 'var(--cui-body-color)' }}>{v as string}</strong> },
    { key: 'price',       label: 'Price',
      render: (v: unknown, row: ListingRow) => `${row.currency} ${(v as number).toLocaleString()} / ${(row.priceUnit as string).replace('per_', '')}` },
    { key: 'avgRating',   label: 'Rating',  render: (v: unknown) => <span>{'★'.repeat(Math.round(v as number))} {(v as number).toFixed(1)}</span> },
    { key: 'status',      label: 'Status',
      render: (v: unknown) => {
        const s = v as ServiceListingStatus;
        const c = STATUS_COLORS[s];
        return <span style={{ padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: c.bg, color: c.text, textTransform: 'capitalize' }}>{s}</span>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {SERVICE_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => { setServiceType(t === 'All' ? '' : t); setPage(1); }}
            style={FILTER_BTN((t === 'All' && !serviceType) || serviceType === t)}
          >
            {t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <input
          placeholder="Filter by destination…"
          value={destination}
          onChange={(e) => { setDestination(e.target.value); setPage(1); }}
          style={{ marginLeft: 'auto', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--cui-border-color)', fontSize: '0.8125rem', color: 'var(--cui-body-color)', background: 'var(--cui-body-bg, #fff)', width: 200 }}
        />
        <Button color="primary" onClick={onCreateNew}>New Listing</Button>
      </div>

      <DataTable<ListingRow>
        columns={columns}
        data={rows}
        loading={isLoading}
        totalRecords={data?.total}
        page={page}
        pageSize={data?.limit ?? 20}
        onPageChange={setPage}
        onRowClick={(row) => onView(row.id as string)}
        rowActions={(row) => [
          { label: 'View',    onClick: () => onView(row.id as string) },
          ...(row.status === 'draft' ? [{ label: publishing ? 'Publishing…' : 'Publish', onClick: () => publish(row.id as string) }] : []),
        ]}
        emptyTitle="No service listings"
        emptyDescription="Create your first service listing to get started."
      />
    </div>
  );
}

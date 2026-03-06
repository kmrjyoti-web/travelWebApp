'use client';
import React, { useState } from 'react';
import { DataTable, SearchInput, ColorBadge, Alert } from '@/shared/components';
import type { DataTableColumn } from '@/shared/components';
import { useB2BListings } from '../hooks/useB2B';
import type { B2BListingRecord, PaginatedResult } from '@/shared/services/b2b.service';

type ListingRow = B2BListingRecord & Record<string, unknown>;

const STATUS_FILTERS = [
  { label: 'All',       value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft',     value: 'draft' },
  { label: 'Archived',  value: 'archived' },
];

const PAGE_SIZE = 20;

function fmtAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function ListingsPanel() {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [country, setCountry] = useState('');

  const { data: paged, isLoading, error } = useB2BListings({
    page,
    limit:               PAGE_SIZE,
    status:              status  || undefined,
    destinationCountry:  country || undefined,
  });

  const typed = paged as PaginatedResult<B2BListingRecord> | undefined;
  const all   = (typed?.items ?? []) as ListingRow[];
  const total = typed?.total ?? 0;

  const rows = search
    ? all.filter(r =>
        (r.title as string).toLowerCase().includes(search.toLowerCase()) ||
        (r.destinationCountry as string).toLowerCase().includes(search.toLowerCase()) ||
        ((r.destinationCity as string | undefined) ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : all;

  const columns: DataTableColumn<ListingRow>[] = [
    {
      key: 'title',
      label: 'Package',
      render: (val, row) => (
        <span>
          <div style={{ fontWeight: 600 }}>{String(val)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tos-secondary, #6b7280)' }}>
            {row.tierName as string}
          </div>
        </span>
      ),
    },
    {
      key: 'destinationCountry',
      label: 'Destination',
      render: (val, row) => (
        <span>
          {String(val)}
          {row.destinationCity && (
            <span style={{ color: 'var(--tos-secondary, #6b7280)' }}> / {row.destinationCity as string}</span>
          )}
        </span>
      ),
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      align: 'right' as const,
      render: (val, row) => (
        <span style={{ fontWeight: 600 }}>
          {fmtAmount(val as number, row.currency as string)}
        </span>
      ),
    },
    {
      key: 'visibility',
      label: 'Visibility',
      render: (val) => <ColorBadge value={String(val)} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <ColorBadge value={String(val)} />,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', maxWidth: 280 }}>
          <SearchInput
            placeholder="Search packages…"
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
          />
        </div>

        <input
          type="text"
          value={country}
          onChange={(e) => { setCountry(e.target.value); setPage(1); }}
          placeholder="Country…"
          style={{ padding: '0.375rem 0.625rem', borderRadius: '0.375rem', border: '1px solid var(--cui-border-color, #d1d5db)', fontSize: '0.875rem', color: 'var(--cui-body-color, #374151)', background: 'var(--cui-body-bg, #fff)', width: 130 }}
        />

        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1); }}
              style={{
                padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid', fontSize: '0.8125rem', cursor: 'pointer',
                background:  status === f.value ? 'var(--cui-primary, #1B4F72)' : 'transparent',
                color:       status === f.value ? '#fff' : 'var(--cui-body-color, #374151)',
                borderColor: status === f.value ? 'var(--cui-primary, #1B4F72)' : 'var(--cui-border-color, #d1d5db)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <Alert color="danger" className="mb-3">Failed to load listings.</Alert>}

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        totalRecords={total}
        onPageChange={setPage}
        emptyTitle="No listings found"
        emptyDescription="Try adjusting your filters."
      />
    </div>
  );
}

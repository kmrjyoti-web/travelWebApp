'use client';
import React, { useState } from 'react';
import { DataTable, ColorBadge, Button, Alert } from '@/shared/components';
import type { DataTableColumn } from '@/shared/components';
import { useRFQs } from '../hooks/useB2B';
import type { RFQRecord, PaginatedResult } from '@/shared/services/b2b.service';

type RFQRow = RFQRecord & Record<string, unknown>;

const STATUS_FILTERS = [
  { label: 'All',      value: '' },
  { label: 'Open',     value: 'open' },
  { label: 'Bidding',  value: 'bidding' },
  { label: 'Awarded',  value: 'awarded' },
  { label: 'Expired',  value: 'expired' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PAGE_SIZE = 20;

function fmtDate(d?: string) {
  if (!d) return '—';
  try { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(d)); }
  catch { return d; }
}

function fmtBudget(min?: number, max?: number) {
  if (!min && !max) return '—';
  if (min && max) return `₹${min.toLocaleString()} – ₹${max.toLocaleString()}`;
  if (min) return `≥ ₹${min.toLocaleString()}`;
  return `≤ ₹${max!.toLocaleString()}`;
}

interface RFQsPanelProps {
  onCreateRFQ: () => void;
}

export function RFQsPanel({ onCreateRFQ }: RFQsPanelProps) {
  const [page, setPage]     = useState(1);
  const [status, setStatus] = useState('');

  const { data: paged, isLoading, error } = useRFQs({ page, limit: PAGE_SIZE, status: status || undefined });

  const typed = paged as PaginatedResult<RFQRecord> | undefined;
  const rows  = (typed?.items ?? []) as RFQRow[];
  const total = typed?.total ?? 0;

  const columns: DataTableColumn<RFQRow>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (val, row) => (
        <span>
          <div style={{ fontWeight: 600 }}>{String(val)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tos-secondary, #6b7280)' }}>
            {row.destinationCountry as string}
            {row.destinationCity && ` / ${row.destinationCity as string}`}
          </div>
        </span>
      ),
    },
    {
      key: 'travelDatesStart',
      label: 'Travel Dates',
      render: (val, row) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {fmtDate(val as string)} – {fmtDate(row.travelDatesEnd as string)}
        </span>
      ),
    },
    {
      key: 'paxCount',
      label: 'Pax',
      align: 'center' as const,
    },
    {
      key: 'budgetMin',
      label: 'Budget',
      render: (val, row) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {fmtBudget(val as number | undefined, row.budgetMax as number | undefined)}
        </span>
      ),
    },
    {
      key: 'deadline',
      label: 'Deadline',
      render: (val) => {
        const isExpired = new Date(val as string) < new Date();
        return (
          <span style={{ fontSize: '0.8125rem', color: isExpired ? '#ef4444' : undefined }}>
            {fmtDate(val as string)}
          </span>
        );
      },
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

        <Button color="primary" leftIcon="Plus" onClick={onCreateRFQ} style={{ marginLeft: 'auto' }}>
          New RFQ
        </Button>
      </div>

      {error && <Alert color="danger" className="mb-3">Failed to load RFQs.</Alert>}

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        totalRecords={total}
        onPageChange={setPage}
        emptyTitle="No RFQs found"
        emptyDescription="Post an RFQ to get competitive bids from agents."
      />
    </div>
  );
}

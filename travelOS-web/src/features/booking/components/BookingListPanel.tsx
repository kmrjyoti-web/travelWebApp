'use client';
import React, { useState, useCallback } from 'react';
import {
  DataTable,
  SearchInput,
  ColorBadge,
  Button,
  useConfirmDialog,
  Alert,
  StatCard,
  TextField,
} from '@/shared/components';
import type { DataTableColumn } from '@/shared/components';
import { useBookings, useCancelBooking } from '../hooks/useBookings';
import type { BookingRecord, PaginatedBookings } from '@/shared/services/booking.service';

type BookingRow = BookingRecord & Record<string, unknown>;

const STATUS_FILTERS = [
  { label: 'All',       value: '' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PAGE_SIZE = 20;

function fmtDate(d: string) {
  try { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(d)); }
  catch { return d; }
}

function fmtAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

interface BookingListPanelProps {
  onView: (id: string) => void;
}

export function BookingListPanel({ onView }: BookingListPanelProps) {
  const { confirm, ConfirmDialogPortal } = useConfirmDialog();
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate]     = useState('');
  const [error, setError]       = useState<string | null>(null);

  const { data: paged, isLoading } = useBookings({
    page,
    limit:    PAGE_SIZE,
    status:   status   || undefined,
    fromDate: fromDate || undefined,
    toDate:   toDate   || undefined,
  });

  const cancelMutation = useCancelBooking();

  const handleCancel = useCallback(async (row: BookingRow) => {
    const ok = await confirm({
      type: 'danger',
      title: 'Cancel Booking',
      message: `Cancel booking ${row.bookingNumber as string} for ${row.customerName as string}?`,
      confirmText: 'Cancel Booking',
    });
    if (!ok) return;
    try {
      await cancelMutation.mutateAsync({ id: row.id as string, reason: 'Cancelled by agent' });
      setError(null);
    } catch {
      setError('Failed to cancel booking.');
    }
  }, [confirm, cancelMutation]);

  const typed = paged as PaginatedBookings | undefined;
  const rows  = (typed?.items ?? []) as BookingRow[];
  const total = typed?.total ?? 0;

  // Derive quick stats from visible rows
  const pending   = rows.filter(r => r.status === 'pending').length;
  const confirmed = rows.filter(r => r.status === 'confirmed').length;
  const revenue   = rows.reduce((s, r) => s + (r.totalAmount as number), 0);

  const columns: DataTableColumn<BookingRow>[] = [
    {
      key: 'bookingNumber',
      label: 'Booking',
      render: (val, row) => (
        <span>
          <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.875rem' }}>{String(val)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tos-secondary, #6b7280)' }}>
            {row.customerName as string}
          </div>
        </span>
      ),
    },
    {
      key: 'customerEmail',
      label: 'Contact',
      render: (val, row) => (
        <span>
          <div style={{ fontSize: '0.8125rem' }}>{String(val)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tos-secondary, #6b7280)' }}>
            {row.customerPhone as string}
          </div>
        </span>
      ),
    },
    { key: 'tierName', label: 'Tier' },
    {
      key: 'paxCount',
      label: 'Pax',
      align: 'center' as const,
    },
    {
      key: 'totalAmount',
      label: 'Total',
      align: 'right' as const,
      render: (val, row) => (
        <span style={{ fontWeight: 600 }}>
          {fmtAmount(val as number, row.currency as string)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <ColorBadge value={String(val)} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (val) => <span style={{ fontSize: '0.8125rem' }}>{fmtDate(String(val))}</span>,
    },
  ];

  // Client-side search filter (by bookingNumber or customerName)
  const filtered = search
    ? rows.filter(r =>
        (r.bookingNumber as string).toLowerCase().includes(search.toLowerCase()) ||
        (r.customerName  as string).toLowerCase().includes(search.toLowerCase()) ||
        (r.customerEmail as string).toLowerCase().includes(search.toLowerCase()),
      )
    : rows;

  return (
    <div>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="Total"     value={total}     icon="BookOpen"    iconColor="#3b82f6" />
        <StatCard title="Pending"   value={pending}   icon="Clock"       iconColor="#f59e0b" />
        <StatCard title="Confirmed" value={confirmed} icon="CircleCheck" iconColor="#10b981" />
        <StatCard title="Revenue"   value={`₹${(revenue / 1000).toFixed(0)}K`} icon="IndianRupee" iconColor="#6366f1" />
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', maxWidth: 300 }}>
          <SearchInput
            placeholder="Search by booking #, name, email…"
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1); }}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                background:  status === f.value ? 'var(--cui-primary, #1B4F72)' : 'transparent',
                color:       status === f.value ? '#fff' : 'var(--cui-body-color, #374151)',
                borderColor: status === f.value ? 'var(--cui-primary, #1B4F72)' : 'var(--cui-border-color, #d1d5db)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <TextField
            label="From date"
            variant="outlined"
            size="sm"
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
            aria-label="From date"
          />
          <span style={{ color: 'var(--tos-secondary, #6b7280)', fontSize: '0.875rem' }}>—</span>
          <TextField
            label="To date"
            variant="outlined"
            size="sm"
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setPage(1); }}
            aria-label="To date"
          />
          {(fromDate || toDate) && (
            <Button
              color="secondary"
              variant="ghost"
              size="sm"
              onClick={() => { setFromDate(''); setToDate(''); setPage(1); }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {error && <Alert color="danger" className="mb-3">{error}</Alert>}

      <DataTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        totalRecords={total}
        onPageChange={setPage}
        emptyTitle="No bookings found"
        emptyDescription="Try adjusting your filters or date range."
        rowActions={(row) => [
          { label: 'View',   icon: 'Eye'    as const, onClick: () => onView(row.id as string) },
          ...(
            (row.status === 'pending' || row.status === 'confirmed')
              ? [{ label: 'Cancel', icon: 'X' as const, onClick: () => void handleCancel(row), variant: 'danger' as const }]
              : []
          ),
        ]}
      />

      <ConfirmDialogPortal />
    </div>
  );
}

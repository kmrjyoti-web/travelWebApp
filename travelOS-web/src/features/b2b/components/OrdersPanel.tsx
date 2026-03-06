'use client';
import React, { useState, useCallback } from 'react';
import { DataTable, ColorBadge, Button, useConfirmDialog, Alert } from '@/shared/components';
import type { DataTableColumn } from '@/shared/components';
import { useB2BOrders, useConfirmB2BOrder } from '../hooks/useB2B';
import type { B2BOrderRecord, PaginatedResult } from '@/shared/services/b2b.service';

type OrderRow = B2BOrderRecord & Record<string, unknown>;

const STATUS_FILTERS = [
  { label: 'All',       value: '' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PAGE_SIZE = 20;

function fmtAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function fmtDate(d?: string) {
  if (!d) return '—';
  try { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(d)); }
  catch { return d; }
}

export function OrdersPanel() {
  const { confirm, ConfirmDialogPortal } = useConfirmDialog();
  const [page, setPage]     = useState(1);
  const [status, setStatus] = useState('');
  const [error, setError]   = useState<string | null>(null);

  const { data: paged, isLoading } = useB2BOrders({ page, limit: PAGE_SIZE, status: status || undefined });
  const confirmMutation = useConfirmB2BOrder();

  const handleConfirm = useCallback(async (row: OrderRow) => {
    const ok = await confirm({
      type: 'success',
      title: 'Confirm B2B Order',
      message: `Confirm order ${row.orderNumber as string}? This will initiate payment processing.`,
      confirmText: 'Confirm Order',
    });
    if (!ok) return;
    try {
      await confirmMutation.mutateAsync(row.id as string);
      setError(null);
    } catch {
      setError('Failed to confirm order.');
    }
  }, [confirm, confirmMutation]);

  const typed = paged as PaginatedResult<B2BOrderRecord> | undefined;
  const rows  = (typed?.items ?? []) as OrderRow[];
  const total = typed?.total ?? 0;

  const columns: DataTableColumn<OrderRow>[] = [
    {
      key: 'orderNumber',
      label: 'Order #',
      render: (val) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.875rem' }}>{String(val)}</span>
      ),
    },
    {
      key: 'seatsRequested',
      label: 'Seats',
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
      key: 'paymentTerms',
      label: 'Terms',
      render: (val) => <ColorBadge value={String(val)} />,
    },
    {
      key: 'paymentDueDate',
      label: 'Due',
      render: (val) => <span style={{ fontSize: '0.8125rem' }}>{fmtDate(val as string | undefined)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <ColorBadge value={String(val)} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (val) => <span style={{ fontSize: '0.8125rem' }}>{fmtDate(val as string)}</span>,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
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

      {error && <Alert color="danger" className="mb-3">{error}</Alert>}

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        totalRecords={total}
        onPageChange={setPage}
        emptyTitle="No orders found"
        emptyDescription="Your B2B orders will appear here."
        rowActions={(row) => [
          ...(row.status === 'pending'
            ? [{ label: 'Confirm', icon: 'CircleCheck' as const, onClick: () => void handleConfirm(row) }]
            : []),
        ]}
      />

      <ConfirmDialogPortal />
    </div>
  );
}

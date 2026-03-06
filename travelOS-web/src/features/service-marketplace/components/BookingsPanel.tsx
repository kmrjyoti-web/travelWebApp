'use client';
import React, { useState } from 'react';
import { DataTable, Alert, Button } from '@/shared/components';
import { useServiceBookings, useConfirmServiceBooking, useCancelServiceBooking } from '../hooks/useServiceMarketplace';
import type { ServiceBooking, ServiceBookingStatus } from '@/shared/services/service-marketplace.service';

type BookingRow = ServiceBooking & Record<string, unknown>;

const STATUS_COLORS: Record<ServiceBookingStatus, { bg: string; text: string }> = {
  pending:   { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  completed: { bg: '#dcfce7', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

const ROLE_BTN = (active: boolean): React.CSSProperties => ({
  padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '1px solid', fontSize: '0.8125rem', cursor: 'pointer',
  background:  active ? 'var(--cui-primary, #1B4F72)' : 'transparent',
  color:       active ? '#fff' : 'var(--cui-body-color)',
  borderColor: active ? 'var(--cui-primary, #1B4F72)' : 'var(--cui-border-color, #d1d5db)',
});

export function BookingsPanel() {
  const [role, setRole]   = useState<'customer' | 'provider'>('customer');
  const [page, setPage]   = useState(1);

  const { data, isLoading, error, refetch } = useServiceBookings(role, page);

  const { mutate: confirm, isPending: confirming } = useConfirmServiceBooking({ onSuccess: () => refetch() });
  const { mutate: cancel,  isPending: cancelling  } = useCancelServiceBooking({ onSuccess: () => refetch() });

  if (error) return <Alert color="danger">Failed to load service bookings.</Alert>;

  const rows = (data?.items ?? []) as BookingRow[];

  const columns = [
    { key: 'serviceBookingNumber', label: 'Booking #', render: (v: unknown) => <code style={{ fontSize: '0.8125rem' }}>{v as string}</code> },
    { key: 'serviceDate',  label: 'Service Date', render: (v: unknown) => new Date(v as string).toLocaleDateString('en-IN') },
    { key: 'paxCount',     label: 'Pax',          render: (v: unknown) => String(v) },
    { key: 'totalPrice',   label: 'Amount',        render: (v: unknown, row: BookingRow) => `${row.currency} ${(v as number).toLocaleString()}` },
    { key: 'paymentStatus', label: 'Payment',
      render: (v: unknown) => {
        const color = v === 'paid' ? '#065f46' : v === 'refunded' ? '#6b7280' : '#92400e';
        return <span style={{ fontSize: '0.75rem', fontWeight: 600, color, textTransform: 'capitalize' }}>{v as string}</span>;
      },
    },
    { key: 'status', label: 'Status',
      render: (v: unknown) => {
        const s = v as ServiceBookingStatus;
        const c = STATUS_COLORS[s];
        return <span style={{ padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: c.bg, color: c.text, textTransform: 'capitalize' }}>{s}</span>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Role toggle */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => { setRole('customer'); setPage(1); }} style={ROLE_BTN(role === 'customer')}>As Customer</button>
        <button onClick={() => { setRole('provider'); setPage(1); }} style={ROLE_BTN(role === 'provider')}>As Provider</button>
      </div>

      <DataTable<BookingRow>
        columns={columns}
        data={rows}
        loading={isLoading}
        totalRecords={data?.total}
        page={page}
        pageSize={data?.limit ?? 20}
        onPageChange={setPage}
        rowActions={(row) => [
          ...(row.status === 'pending' && role === 'provider'
            ? [{ label: confirming ? 'Confirming…' : 'Confirm', onClick: () => confirm(row.id as string) }]
            : []),
          ...((row.status === 'pending' || row.status === 'confirmed')
            ? [{ label: cancelling ? 'Cancelling…' : 'Cancel', variant: 'danger' as const, onClick: () => cancel({ id: row.id as string }) }]
            : []),
        ]}
        emptyTitle="No service bookings"
        emptyDescription="Book a service from the listings tab to get started."
      />
    </div>
  );
}

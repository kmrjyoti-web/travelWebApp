'use client';
import React from 'react';
import { ColorBadge, Button, Alert } from '@/shared/components';
import { useBooking, useCancelBooking } from '../hooks/useBookings';

function fmtDate(d?: string) {
  if (!d) return '—';
  try { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d)); }
  catch { return d; }
}

function fmtAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

const SECTION: React.CSSProperties = {
  marginBottom: '1.5rem',
};

const LABEL: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 500,
  color: 'var(--cui-secondary-color, #6b7280)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  marginBottom: '0.25rem',
};

const VALUE: React.CSSProperties = {
  fontSize: '0.9375rem',
  color: 'var(--cui-body-color, #374151)',
};

const ROW: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  marginBottom: '1rem',
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p style={LABEL}>{label}</p>
      <p style={VALUE}>{value ?? '—'}</p>
    </div>
  );
}

interface BookingDetailPanelProps {
  bookingId: string;
  onClose: () => void;
}

export function BookingDetailPanel({ bookingId, onClose }: BookingDetailPanelProps) {
  const { data: booking, isLoading, error } = useBooking(bookingId);
  const cancelMutation = useCancelBooking({ onSuccess: onClose });
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ id: bookingId, reason: 'Cancelled by agent' });
    } catch {
      setCancelError('Failed to cancel booking. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cui-secondary-color, #6b7280)' }}>
        Loading booking details…
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert color="danger">Failed to load booking details.</Alert>
        <Button color="secondary" variant="outline" onClick={onClose} className="mt-3">Close</Button>
      </div>
    );
  }

  const b = booking;
  const canCancel = b.status === 'pending' || b.status === 'confirmed';

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color, #6b7280)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Booking Reference
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, color: 'var(--cui-body-color, #111827)' }}>
            {b.bookingNumber}
          </div>
        </div>
        <ColorBadge value={b.status} />
      </div>

      {cancelError && <Alert color="danger" className="mb-3">{cancelError}</Alert>}

      {/* Customer */}
      <div style={SECTION}>
        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--cui-body-color, #374151)', borderBottom: '1px solid var(--cui-border-color, #e5e7eb)', paddingBottom: '0.5rem' }}>
          Customer
        </h4>
        <div style={ROW}>
          <Field label="Name"  value={b.customerName} />
          <Field label="Email" value={b.customerEmail} />
        </div>
        <Field label="Phone" value={b.customerPhone} />
      </div>

      {/* Trip */}
      <div style={SECTION}>
        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--cui-body-color, #374151)', borderBottom: '1px solid var(--cui-border-color, #e5e7eb)', paddingBottom: '0.5rem' }}>
          Trip Details
        </h4>
        <div style={ROW}>
          <Field label="Tier"  value={b.tierName} />
          <Field label="Pax"   value={b.paxCount} />
        </div>
        {b.notes && <Field label="Notes" value={b.notes} />}
      </div>

      {/* Pricing */}
      <div style={SECTION}>
        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--cui-body-color, #374151)', borderBottom: '1px solid var(--cui-border-color, #e5e7eb)', paddingBottom: '0.5rem' }}>
          Pricing
        </h4>
        <div style={ROW}>
          <Field label="Unit Price"    value={fmtAmount(b.unitPrice,    b.currency)} />
          <Field label="Ancillaries"   value={fmtAmount(b.ancillaryTotal, b.currency)} />
        </div>
        <div style={ROW}>
          <Field label="Discount"      value={b.discountAmount > 0 ? `-${fmtAmount(b.discountAmount, b.currency)}` : '—'} />
          <Field label="Tax"           value={fmtAmount(b.taxAmount, b.currency)} />
        </div>
        <div style={{ padding: '0.75rem', background: 'var(--cui-secondary-bg, #f9fafb)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: 'var(--cui-body-color, #374151)' }}>Total</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cui-primary, #1B4F72)' }}>
            {fmtAmount(b.totalAmount, b.currency)}
          </span>
        </div>
        {b.promoCode && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--cui-secondary-color, #6b7280)' }}>
            Promo: <code style={{ fontFamily: 'monospace' }}>{b.promoCode}</code>
          </div>
        )}
      </div>

      {/* Payment */}
      {(b.paymentOrderId || b.paymentTransactionId) && (
        <div style={SECTION}>
          <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--cui-body-color, #374151)', borderBottom: '1px solid var(--cui-border-color, #e5e7eb)', paddingBottom: '0.5rem' }}>
            Payment
          </h4>
          <div style={ROW}>
            <Field label="Order ID"       value={b.paymentOrderId} />
            <Field label="Transaction ID" value={b.paymentTransactionId} />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={SECTION}>
        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--cui-body-color, #374151)', borderBottom: '1px solid var(--cui-border-color, #e5e7eb)', paddingBottom: '0.5rem' }}>
          Timeline
        </h4>
        <div style={ROW}>
          <Field label="Created"    value={fmtDate(b.createdAt)} />
          <Field label="Confirmed"  value={fmtDate(b.confirmedAt)} />
        </div>
        {b.cancelledAt && (
          <div style={ROW}>
            <Field label="Cancelled"          value={fmtDate(b.cancelledAt)} />
            <Field label="Cancellation Reason" value={b.cancellationReason} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
        {canCancel && (
          <Button
            color="danger"
            variant="outline"
            leftIcon="X"
            loading={cancelMutation.isPending}
            onClick={() => void handleCancel()}
          >
            Cancel Booking
          </Button>
        )}
        <Button color="secondary" variant="outline" onClick={onClose} style={{ marginLeft: 'auto' }}>
          Close
        </Button>
      </div>
    </div>
  );
}

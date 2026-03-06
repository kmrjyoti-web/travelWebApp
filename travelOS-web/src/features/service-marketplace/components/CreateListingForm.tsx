'use client';
import React, { useState } from 'react';
import { Button, Alert } from '@/shared/components';
import { useCreateListing } from '../hooks/useServiceMarketplace';
import type { CreateListingParams, ServicePriceUnit } from '@/shared/services/service-marketplace.service';

const SERVICE_TYPES = ['visa', 'guide', 'photographer', 'transfer', 'insurance', 'religious'];
const PRICE_UNITS: ServicePriceUnit[] = ['per_person', 'per_trip', 'per_hour', 'per_day', 'per_application'];

const FIELD: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--cui-border-color, #d1d5db)',
  fontSize: '0.875rem',
  color: 'var(--cui-body-color)',
  background: 'var(--cui-body-bg, #fff)',
  boxSizing: 'border-box',
};

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--cui-secondary-color, #6b7280)',
  marginBottom: '0.375rem',
};

const GRID2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '1rem',
};

interface CreateListingFormProps {
  onCreated: () => void;
  onCancel:  () => void;
}

export function CreateListingForm({ onCreated, onCancel }: CreateListingFormProps) {
  const [form, setForm] = useState<Partial<CreateListingParams>>({
    currency: 'INR',
    priceUnit: 'per_person',
    advanceBookingDays: 2,
    isInstantBooking: false,
  });

  const { mutate, isPending, error } = useCreateListing({ onSuccess: onCreated });

  const set = <K extends keyof CreateListingParams>(k: K, v: CreateListingParams[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceType || !form.title || !form.price || !form.priceUnit) return;
    mutate(form as CreateListingParams);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && <Alert color="danger">{String(error)}</Alert>}

      <div style={GRID2}>
        <div>
          <label style={LABEL}>Service Type *</label>
          <select style={FIELD} value={form.serviceType ?? ''} onChange={(e) => set('serviceType', e.target.value)} required>
            <option value="">— Select Type —</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={LABEL}>Title *</label>
          <input style={FIELD} placeholder="e.g. Delhi Airport Transfer, Goa Photographer" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} required />
        </div>
      </div>

      <div>
        <label style={LABEL}>Description</label>
        <textarea style={{ ...FIELD, minHeight: 80, resize: 'vertical' }} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} />
      </div>

      <div style={GRID2}>
        <div>
          <label style={LABEL}>Price *</label>
          <input type="number" min={0} style={FIELD} value={form.price ?? ''} onChange={(e) => set('price', Number(e.target.value))} required />
        </div>
        <div>
          <label style={LABEL}>Currency</label>
          <select style={FIELD} value={form.currency ?? 'INR'} onChange={(e) => set('currency', e.target.value)}>
            {['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={LABEL}>Price Unit *</label>
          <select style={FIELD} value={form.priceUnit ?? 'per_person'} onChange={(e) => set('priceUnit', e.target.value as ServicePriceUnit)}>
            {PRICE_UNITS.map((u) => <option key={u} value={u}>{u.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label style={LABEL}>Max Pax</label>
          <input type="number" min={1} style={FIELD} value={form.maxPax ?? ''} onChange={(e) => set('maxPax', e.target.value ? Number(e.target.value) : undefined)} />
        </div>
        <div>
          <label style={LABEL}>Advance Booking (days)</label>
          <input type="number" min={0} style={FIELD} value={form.advanceBookingDays ?? 2} onChange={(e) => set('advanceBookingDays', Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
          <input
            type="checkbox"
            id="isInstantBooking"
            checked={form.isInstantBooking ?? false}
            onChange={(e) => set('isInstantBooking', e.target.checked)}
          />
          <label htmlFor="isInstantBooking" style={{ fontSize: '0.875rem', color: 'var(--cui-body-color)', cursor: 'pointer' }}>
            Instant Booking
          </label>
        </div>
      </div>

      <div>
        <label style={LABEL}>Duration Description</label>
        <input style={FIELD} placeholder="e.g. 2-3 hours, Full day, Half day" value={form.durationDescription ?? ''} onChange={(e) => set('durationDescription', e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button color="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button color="primary" type="submit" disabled={isPending}>
          {isPending ? 'Creating…' : 'Create Listing'}
        </Button>
      </div>
    </form>
  );
}

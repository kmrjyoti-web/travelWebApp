'use client';
import React, { useState } from 'react';
import { Button, Alert, TextField, SelectField, TextareaField, Checkbox } from '@/shared/components';
import { useCreateListing } from '../hooks/useServiceMarketplace';
import type { CreateListingParams, ServicePriceUnit } from '@/shared/services/service-marketplace.service';

const SERVICE_TYPES = ['visa', 'guide', 'photographer', 'transfer', 'insurance', 'religious'];
const PRICE_UNITS: ServicePriceUnit[] = ['per_person', 'per_trip', 'per_hour', 'per_day', 'per_application'];

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
        <SelectField
          label="Service Type *"
          variant="outlined"
          size="sm"
          value={form.serviceType ?? ''}
          onChange={(e) => set('serviceType', e.target.value)}
          required
        >
          <option value="">— Select Type —</option>
          {SERVICE_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </SelectField>
        <div style={{ gridColumn: '1 / -1' }}>
          <TextField
            label="Title *"
            variant="outlined"
            size="sm"
            placeholder="e.g. Delhi Airport Transfer, Goa Photographer"
            value={form.title ?? ''}
            onChange={(e) => set('title', e.target.value)}
            required
          />
        </div>
      </div>

      <TextareaField
        label="Description"
        variant="outlined"
        size="sm"
        value={form.description ?? ''}
        onChange={(e) => set('description', e.target.value)}
        minRows={3}
      />

      <div style={GRID2}>
        <TextField
          label="Price *"
          variant="outlined"
          size="sm"
          type="number"
          min={0}
          value={form.price ?? ''}
          onChange={(e) => set('price', Number(e.target.value))}
          required
        />
        <SelectField
          label="Currency"
          variant="outlined"
          size="sm"
          value={form.currency ?? 'INR'}
          onChange={(e) => set('currency', e.target.value)}
        >
          {['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectField>
        <SelectField
          label="Price Unit *"
          variant="outlined"
          size="sm"
          value={form.priceUnit ?? 'per_person'}
          onChange={(e) => set('priceUnit', e.target.value as ServicePriceUnit)}
        >
          {PRICE_UNITS.map((u) => (
            <option key={u} value={u}>{u.replace(/_/g, ' ')}</option>
          ))}
        </SelectField>
        <TextField
          label="Max Pax"
          variant="outlined"
          size="sm"
          type="number"
          min={1}
          value={form.maxPax ?? ''}
          onChange={(e) => set('maxPax', e.target.value ? Number(e.target.value) : undefined)}
        />
        <TextField
          label="Advance Booking (days)"
          variant="outlined"
          size="sm"
          type="number"
          min={0}
          value={form.advanceBookingDays ?? 2}
          onChange={(e) => set('advanceBookingDays', Number(e.target.value))}
        />
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
          <Checkbox
            label="Instant Booking"
            checked={form.isInstantBooking ?? false}
            onChange={(e) => set('isInstantBooking', e.target.checked)}
          />
        </div>
      </div>

      <TextField
        label="Duration Description"
        variant="outlined"
        size="sm"
        placeholder="e.g. 2-3 hours, Full day, Half day"
        value={form.durationDescription ?? ''}
        onChange={(e) => set('durationDescription', e.target.value)}
      />

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button color="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button color="primary" type="submit" disabled={isPending}>
          {isPending ? 'Creating…' : 'Create Listing'}
        </Button>
      </div>
    </form>
  );
}

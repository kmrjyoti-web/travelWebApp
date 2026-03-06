'use client';
import React, { useState } from 'react';
import { Button, Alert } from '@/shared/components';
import { useGenerateAIItinerary } from '../hooks/useAIItinerary';
import type { GenerateAIItineraryParams } from '@/shared/services/ai-itinerary.service';

const THEMES = ['Adventure', 'Relaxation', 'Cultural', 'Honeymoon', 'Family', 'Business', 'Eco-Tourism'];

const FIELD: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--cui-border-color, #d1d5db)',
  fontSize: '0.875rem',
  color: 'var(--cui-body-color, #374151)',
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
};

interface GenerateFormProps {
  onStarted: (requestId: string) => void;
}

export function GenerateForm({ onStarted }: GenerateFormProps) {
  const [form, setForm] = useState<Partial<GenerateAIItineraryParams>>({
    currency: 'INR',
    groupSize: 2,
    durationDays: 7,
    budgetPerPerson: 50000,
  });

  const { mutate, isPending, error } = useGenerateAIItinerary({
    onSuccess: onStarted,
  });

  const set = <K extends keyof GenerateAIItineraryParams>(k: K, v: GenerateAIItineraryParams[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destinationCountry || !form.travelDates?.from || !form.travelDates?.to) return;
    mutate(form as GenerateAIItineraryParams);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && <Alert color="danger">{String(error)}</Alert>}

      <div style={GRID2}>
        <div>
          <label style={LABEL}>Destination Country *</label>
          <input
            style={FIELD}
            placeholder="e.g. India, Japan, France"
            value={form.destinationCountry ?? ''}
            onChange={(e) => set('destinationCountry', e.target.value)}
            required
          />
        </div>
        <div>
          <label style={LABEL}>Destination City</label>
          <input
            style={FIELD}
            placeholder="e.g. Tokyo, Bali, Paris"
            value={form.destinationCity ?? ''}
            onChange={(e) => set('destinationCity', e.target.value)}
          />
        </div>
      </div>

      <div style={GRID2}>
        <div>
          <label style={LABEL}>Travel From *</label>
          <input
            type="date"
            style={FIELD}
            value={form.travelDates?.from ?? ''}
            onChange={(e) => set('travelDates', { from: e.target.value, to: form.travelDates?.to ?? '' })}
            required
          />
        </div>
        <div>
          <label style={LABEL}>Travel To *</label>
          <input
            type="date"
            style={FIELD}
            value={form.travelDates?.to ?? ''}
            onChange={(e) => set('travelDates', { from: form.travelDates?.from ?? '', to: e.target.value })}
            required
          />
        </div>
        <div>
          <label style={LABEL}>Duration (Days)</label>
          <input
            type="number"
            style={FIELD}
            min={1}
            max={30}
            value={form.durationDays ?? 7}
            onChange={(e) => set('durationDays', Number(e.target.value))}
          />
        </div>
      </div>

      <div style={GRID2}>
        <div>
          <label style={LABEL}>Group Size</label>
          <input
            type="number"
            style={FIELD}
            min={1}
            max={50}
            value={form.groupSize ?? 2}
            onChange={(e) => set('groupSize', Number(e.target.value))}
          />
        </div>
        <div>
          <label style={LABEL}>Budget Per Person</label>
          <input
            type="number"
            style={FIELD}
            min={0}
            value={form.budgetPerPerson ?? 50000}
            onChange={(e) => set('budgetPerPerson', Number(e.target.value))}
          />
        </div>
        <div>
          <label style={LABEL}>Currency</label>
          <select
            style={FIELD}
            value={form.currency ?? 'INR'}
            onChange={(e) => set('currency', e.target.value)}
          >
            {['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'THB', 'JPY'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={GRID2}>
        <div>
          <label style={LABEL}>Theme</label>
          <select
            style={FIELD}
            value={form.theme ?? ''}
            onChange={(e) => set('theme', e.target.value)}
          >
            <option value="">— Select Theme —</option>
            {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={LABEL}>Special Requirements</label>
          <textarea
            style={{ ...FIELD, minHeight: '80px', resize: 'vertical' }}
            placeholder="Vegetarian food, wheelchair access, specific attractions..."
            value={form.specialRequirements ?? ''}
            onChange={(e) => set('specialRequirements', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" color="primary" disabled={isPending}>
          {isPending ? 'Generating…' : 'Generate AI Itinerary'}
        </Button>
      </div>
    </form>
  );
}

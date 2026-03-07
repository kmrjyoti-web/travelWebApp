'use client';
import React, { useState } from 'react';
import { Button, Alert, TextField, SelectField, TextareaField } from '@/shared/components';
import { useGenerateAIItinerary } from '../hooks/useAIItinerary';
import type { GenerateAIItineraryParams } from '@/shared/services/ai-itinerary.service';

const THEMES = ['Adventure', 'Relaxation', 'Cultural', 'Honeymoon', 'Family', 'Business', 'Eco-Tourism'];

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
        <TextField
          label="Destination Country *"
          variant="outlined"
          size="sm"
          placeholder="e.g. India, Japan, France"
          value={form.destinationCountry ?? ''}
          onChange={(e) => set('destinationCountry', e.target.value)}
          required
        />
        <TextField
          label="Destination City"
          variant="outlined"
          size="sm"
          placeholder="e.g. Tokyo, Bali, Paris"
          value={form.destinationCity ?? ''}
          onChange={(e) => set('destinationCity', e.target.value)}
        />
      </div>

      <div style={GRID2}>
        <TextField
          label="Travel From *"
          variant="outlined"
          size="sm"
          type="date"
          value={form.travelDates?.from ?? ''}
          onChange={(e) => set('travelDates', { from: e.target.value, to: form.travelDates?.to ?? '' })}
          required
        />
        <TextField
          label="Travel To *"
          variant="outlined"
          size="sm"
          type="date"
          value={form.travelDates?.to ?? ''}
          onChange={(e) => set('travelDates', { from: form.travelDates?.from ?? '', to: e.target.value })}
          required
        />
        <TextField
          label="Duration (Days)"
          variant="outlined"
          size="sm"
          type="number"
          min={1}
          max={30}
          value={form.durationDays ?? 7}
          onChange={(e) => set('durationDays', Number(e.target.value))}
        />
      </div>

      <div style={GRID2}>
        <TextField
          label="Group Size"
          variant="outlined"
          size="sm"
          type="number"
          min={1}
          max={50}
          value={form.groupSize ?? 2}
          onChange={(e) => set('groupSize', Number(e.target.value))}
        />
        <TextField
          label="Budget Per Person"
          variant="outlined"
          size="sm"
          type="number"
          min={0}
          value={form.budgetPerPerson ?? 50000}
          onChange={(e) => set('budgetPerPerson', Number(e.target.value))}
        />
        <SelectField
          label="Currency"
          variant="outlined"
          size="sm"
          value={form.currency ?? 'INR'}
          onChange={(e) => set('currency', e.target.value)}
        >
          {['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'THB', 'JPY'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectField>
      </div>

      <div style={GRID2}>
        <SelectField
          label="Theme"
          variant="outlined"
          size="sm"
          value={form.theme ?? ''}
          onChange={(e) => set('theme', e.target.value)}
        >
          <option value="">— Select Theme —</option>
          {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
        <div style={{ gridColumn: '1 / -1' }}>
          <TextareaField
            label="Special Requirements"
            variant="outlined"
            size="sm"
            placeholder="Vegetarian food, wheelchair access, specific attractions..."
            value={form.specialRequirements ?? ''}
            onChange={(e) => set('specialRequirements', e.target.value)}
            minRows={3}
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

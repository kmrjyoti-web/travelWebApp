'use client';
import React from 'react';
import { TextField, SelectField, TextareaField } from '@/shared/components';
import { usePublishStore } from '../stores/publishStore';
import type { GeneralInfo } from '../types/publish.types';

const THEMES       = ['Adventure', 'Beach', 'Cultural', 'Honeymoon', 'Family', 'Wildlife', 'Pilgrimage', 'Wellness', 'Business', 'Group Tour'];
const TRIP_NATURES = ['Adventure', 'Relaxation', 'Cultural', 'Balanced', 'Expedition'];
const CURRENCIES   = ['USD', 'INR', 'EUR', 'GBP', 'AED', 'SGD', 'THB', 'JPY', 'AUD', 'CAD'];
const LANGUAGES    = [{ value: 'en', label: 'English' }, { value: 'hi', label: 'Hindi' }, { value: 'ar', label: 'Arabic' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' }];

const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' };
const mb: React.CSSProperties    = { marginBottom: '1.25rem' };

export function SectionGeneralInfo() {
  const info   = usePublishStore((s) => s.data.generalInfo);
  const update = usePublishStore((s) => s.updateSection);

  const set = (patch: Partial<GeneralInfo>) => update('generalInfo', { ...info, ...patch });

  return (
    <div>
      <div style={mb}>
        <TextField label="Package Title" variant="outlined" size="xs" startIcon="Tag" required
          value={info.title} onChange={(e) => set({ title: e.target.value })} />
      </div>

      <div style={mb}>
        <TextareaField label="Summary / Short Description" variant="outlined" size="sm" required minRows={3}
          value={info.summary} onChange={(e) => set({ summary: e.target.value })} />
      </div>

      <div style={{ ...grid2, ...mb }}>
        <SelectField label="Theme" variant="outlined" size="xs" value={info.theme} onChange={(e) => set({ theme: e.target.value })}>
          <option value="">Select theme…</option>
          {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
        <SelectField label="Trip Nature" variant="outlined" size="xs" value={info.tripNature} onChange={(e) => set({ tripNature: e.target.value })}>
          {TRIP_NATURES.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
      </div>

      <div style={{ ...grid3, ...mb }}>
        <TextField label="Duration (Days)" variant="outlined" size="xs" startIcon="Calendar" type="number" min={1} max={365}
          value={String(info.durationDays)}
          onChange={(e) => set({ durationDays: +e.target.value, durationNights: Math.max(0, +e.target.value - 1) })} />
        <TextField label="Duration (Nights)" variant="outlined" size="xs" startIcon="Moon" type="number" min={0} max={365}
          value={String(info.durationNights)} onChange={(e) => set({ durationNights: +e.target.value })} />
        <SelectField label="Currency" variant="outlined" size="xs" value={info.currency} onChange={(e) => set({ currency: e.target.value })}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </SelectField>
      </div>

      <div style={grid3}>
        <TextField label="Min Pax" variant="outlined" size="xs" startIcon="Users" type="number" min={1}
          value={String(info.minPax)} onChange={(e) => set({ minPax: +e.target.value })} />
        <TextField label="Max Pax" variant="outlined" size="xs" startIcon="Users" type="number" min={1}
          value={String(info.maxPax)} onChange={(e) => set({ maxPax: +e.target.value })} />
        <SelectField label="Content Language" variant="outlined" size="xs" value={info.language} onChange={(e) => set({ language: e.target.value })}>
          {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </SelectField>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { TextField, TextareaField, SelectField, Checkbox, TagsInput } from '@/shared/components';
import { usePublishStore } from '../stores/publishStore';
import type { TripPreferences } from '../types/publish.types';

/* ── Constants ─────────────────────────────────────────────────── */
const BUDGETS        = ['Budget', 'Moderate', 'Luxury', 'Ultra-Luxury'];
const ACCOM_TYPES    = ['Hotel', 'Resort', 'Hostel', 'Villa', 'Airbnb', 'No Preference'];
const STAR_OPTIONS   = ['No Preference', '3-Star', '4-Star', '5-Star'];
const TRIP_NATURES   = ['Adventure', 'Relaxation', 'Cultural', 'Balanced', 'Business', 'Honeymoon', 'Family'];
const SERVICE_OPTIONS = ['Guide', 'Driver', 'Translator', 'Photography', 'Porter', 'Chef', 'Concierge'];

/* ── Block wrapper ──────────────────────────────────────────────── */
const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ border: '1px solid var(--cui-border-color)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem', background: 'var(--cui-body-bg)' }}>
    <p style={{ margin: '0 0 1rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--cui-body-color)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {title}
    </p>
    {children}
  </div>
);

/* ── Main Section ───────────────────────────────────────────────── */
export function SectionTripPreferences() {
  const prefs  = usePublishStore((s) => s.data.tripPreferences);
  const update = usePublishStore((s) => s.updateSection);
  const set    = (patch: Partial<TripPreferences>) => update('tripPreferences', { ...prefs, ...patch });

  return (
    <div>

      {/* ── Destinations & Dates ── */}
      <Block title="Destinations & Dates">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextField
            label="Origin (From)"
            variant="outlined"
            startIcon="MapPin"
            value={prefs.from}
            onChange={(e) => set({ from: e.target.value })}
          />
          <TextField
            label="Destination (To)"
            variant="outlined"
            startIcon="MapPin"
            value={prefs.to}
            onChange={(e) => set({ to: e.target.value })}
          />
          <TextField
            label="Start Date"
            variant="outlined"
            type="date"
            startIcon="Calendar"
            value={prefs.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField
              label="End Date"
              variant="outlined"
              type="date"
              startIcon="Calendar"
              value={prefs.endDate}
              onChange={(e) => set({ endDate: e.target.value })}
            />
            <TextField
              label="Duration (Days)"
              variant="outlined"
              type="number"
              min={1}
              value={prefs.durationDays || ''}
              onChange={(e) => set({ durationDays: +e.target.value })}
            />
          </div>
        </div>
      </Block>

      {/* ── Travelers & Nature ── */}
      <Block title="Travelers & Nature">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField
              label="Adults"
              variant="outlined"
              type="number"
              min={1}
              value={prefs.adults}
              onChange={(e) => set({ adults: +e.target.value })}
            />
            <TextField
              label="Children"
              variant="outlined"
              type="number"
              min={0}
              value={prefs.children}
              onChange={(e) => set({ children: +e.target.value })}
            />
          </div>
          <SelectField
            label="Trip Nature"
            value={prefs.tripNature}
            onChange={(e) => set({ tripNature: e.target.value })}
          >
            {TRIP_NATURES.map((n) => <option key={n} value={n}>{n}</option>)}
          </SelectField>
        </div>
      </Block>

      {/* ── Budget & Stay ── */}
      <Block title="Budget & Stay">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SelectField
            label="Budget Level"
            value={prefs.budget}
            onChange={(e) => set({ budget: e.target.value })}
          >
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </SelectField>

          <TextField
            label="Currency"
            variant="outlined"
            value={prefs.currency}
            onChange={(e) => set({ currency: e.target.value })}
          />

          <SelectField
            label="Accommodation Type"
            value={prefs.accommodationType}
            onChange={(e) => set({ accommodationType: e.target.value })}
          >
            {ACCOM_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
          </SelectField>

          <SelectField
            label="Star Rating"
            value={prefs.starRating}
            onChange={(e) => set({ starRating: e.target.value })}
          >
            {STAR_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </SelectField>
        </div>
      </Block>

      {/* ── Interests & Services ── */}
      <Block title="Interests & Services">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TagsInput
            label="Included Services"
            value={prefs.services}
            onChange={(tags) => set({ services: tags })}
            placeholder="e.g. Guide, Driver"
            helperText="Type a service and press Enter"
          />

          <TextField
            label="Food Preferences"
            variant="outlined"
            value={prefs.foodPreference}
            onChange={(e) => set({ foodPreference: e.target.value })}
          />

          <TextareaField
            label="Interests (Free Text)"
            variant="outlined"
            minRows={3}
            value={prefs.interests}
            onChange={(e) => set({ interests: e.target.value })}
          />

          <Checkbox
            checked={prefs.includeNightlife}
            onChange={(e) => set({ includeNightlife: e.target.checked })}
            label="Include Nightlife"
          />
        </div>
      </Block>

    </div>
  );
}

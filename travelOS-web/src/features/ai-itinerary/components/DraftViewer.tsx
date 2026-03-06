'use client';
import React, { useState } from 'react';
import { Icon, Button, Alert } from '@/shared/components';
import { useAIDraft, useConvertDraft } from '../hooks/useAIItinerary';
import type { AIDayPlanItem } from '@/shared/services/ai-itinerary.service';

interface DraftViewerProps {
  draftId: string;
  onConverted: (itineraryId: string) => void;
  onReset: () => void;
}

const CARD: React.CSSProperties = {
  background: 'var(--cui-card-bg, #fff)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 700,
  color: 'var(--cui-secondary-color, #6b7280)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.75rem',
};

const DAY_CARD: React.CSSProperties = {
  background: 'var(--cui-body-bg, #f8fafc)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
  borderRadius: '0.5rem',
  overflow: 'hidden',
};

const TAG: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.125rem 0.5rem',
  borderRadius: '9999px',
  fontSize: '0.75rem',
  fontWeight: 500,
  background: 'var(--cui-primary-bg-subtle, #e0e7ff)',
  color: 'var(--cui-primary, #1B4F72)',
};

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

function DayCard({ day }: { day: AIDayPlanItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={DAY_CARD}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.875rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={open}
      >
        <span style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--cui-primary, #1B4F72)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0,
        }}>
          {day.day}
        </span>
        <span style={{ flex: 1, fontWeight: 600, color: 'var(--cui-body-color)' }}>{day.title}</span>
        {day.weatherNote && (
          <span style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color, #6b7280)', marginRight: '0.5rem' }}>
            {day.weatherNote}
          </span>
        )}
        <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={16} aria-hidden />
      </button>

      {open && (
        <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {day.activities.map((act, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', paddingLeft: '2.5rem' }}>
              <div style={{ flexShrink: 0, paddingTop: '0.125rem' }}>
                <Icon name="MapPin" size={14} style={{ color: 'var(--cui-primary, #1B4F72)' }} aria-hidden />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color, #6b7280)' }}>{act.time}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--cui-body-color)' }}>{act.name}</span>
                  {act.category && <span style={TAG}>{act.category}</span>}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--cui-secondary-color, #6b7280)', marginTop: '0.125rem' }}>
                  {act.location} · {fmt(act.estimatedCost, act.currency)}
                </div>
                {act.notes && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--cui-secondary-color, #6b7280)', fontStyle: 'italic', marginTop: '0.125rem' }}>
                    {act.notes}
                  </div>
                )}
                {act.transportToNext && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Icon name="ArrowRight" size={12} aria-hidden />
                    {act.transportToNext}
                  </div>
                )}
              </div>
            </div>
          ))}

          {day.accommodation && (
            <div style={{ paddingLeft: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.25rem' }}>
              <Icon name="BedDouble" size={14} style={{ color: '#f59e0b' }} aria-hidden />
              <span style={{ fontSize: '0.8125rem', color: 'var(--cui-body-color)' }}>
                {day.accommodation.name}
                {day.accommodation.stars && ` (${'★'.repeat(day.accommodation.stars)})`}
                {' '}· {fmt(day.accommodation.estPricePerNight, day.accommodation.currency)}/night
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DraftViewer({ draftId, onConverted, onReset }: DraftViewerProps) {
  const { data: draft, isLoading, error } = useAIDraft(draftId);
  const { mutate: convert, isPending: converting } = useConvertDraft({
    onSuccess: (result) => onConverted(result.itineraryId),
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Icon name="LoaderCircle" size={32} style={{ color: 'var(--cui-primary)', animation: 'spin 1s linear infinite' }} aria-hidden />
      </div>
    );
  }

  if (error || !draft) {
    return <Alert color="danger">Failed to load draft itinerary.</Alert>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ ...CARD, background: 'var(--cui-primary, #1B4F72)', color: '#fff', border: 'none' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{draft.title}</h2>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.85 }}>
          Estimated cost: {fmt(draft.totalEstimatedCost, draft.currency)} total
          {draft.weatherSummary && ` · ${draft.weatherSummary}`}
        </div>
      </div>

      {/* Day Plan */}
      <div>
        <p style={SECTION_TITLE}>Day-by-Day Plan</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {draft.dayPlan.map((day) => <DayCard key={day.day} day={day} />)}
        </div>
      </div>

      {/* Includes / Excludes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {draft.includes.length > 0 && (
          <div style={CARD}>
            <p style={SECTION_TITLE}>Included</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {draft.includes.map((item, i) => (
                <li key={i} style={{ fontSize: '0.875rem', color: 'var(--cui-body-color)' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {draft.excludes.length > 0 && (
          <div style={CARD}>
            <p style={SECTION_TITLE}>Excluded</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {draft.excludes.map((item, i) => (
                <li key={i} style={{ fontSize: '0.875rem', color: 'var(--cui-secondary-color, #6b7280)' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Packing + Events */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {draft.packingSuggestions.length > 0 && (
          <div style={CARD}>
            <p style={SECTION_TITLE}>Packing Suggestions</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {draft.packingSuggestions.map((item, i) => (
                <span key={i} style={{ ...TAG, background: 'var(--cui-success-bg-subtle, #d1fae5)', color: '#065f46' }}>{item}</span>
              ))}
            </div>
          </div>
        )}
        {draft.eventsDuringTrip.length > 0 && (
          <div style={CARD}>
            <p style={SECTION_TITLE}>Events During Trip</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {draft.eventsDuringTrip.map((ev, i) => (
                <li key={i} style={{ fontSize: '0.875rem', color: 'var(--cui-body-color)' }}>{ev}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <Button color="secondary" onClick={onReset}>Generate New</Button>
        <Button
          color="primary"
          disabled={converting}
          onClick={() => convert(draftId)}
        >
          {converting ? 'Converting…' : 'Convert to Itinerary'}
        </Button>
      </div>
    </div>
  );
}

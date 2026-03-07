'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, TextareaField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { ItineraryDay } from '../types/publish.types';

/* ── Day Forecast Modal ─────────────────────────────────────────── */
function ForecastModal({
  day,
  onSave,
  onClose,
}: {
  day: ItineraryDay;
  onSave: (forecast: string, attire: string) => void;
  onClose: () => void;
}) {
  const [forecast, setForecast] = useState(day.weather.forecast);
  const [attire,   setAttire]   = useState(day.weather.dressCode);

  const modal = (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 12, width: 500, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '1px solid #e5e7eb' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Day {day.day}
            </p>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
              {day.theme || 'Untitled Day'}
            </h3>
          </div>
          <Button color="secondary" variant="ghost" size="sm" onClick={onClose}
            style={{ borderRadius: '50%', width: 28, height: 28, padding: 0 }}>
            <Icon name="X" size={14} />
          </Button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: '1rem' }}>☀️</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Forecast</span>
            </div>
            <TextareaField
              label="Describe today's weather forecast"
              variant="outlined"
              minRows={3}
              value={forecast}
              onChange={(e) => setForecast(e.target.value)}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Icon name="Shirt" size={14} style={{ color: '#4f46e5' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Attire</span>
            </div>
            <TextareaField
              label="Clothing & packing advice for this day"
              variant="outlined"
              minRows={3}
              value={attire}
              onChange={(e) => setAttire(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0.875rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
          <Button color="secondary" variant="ghost" size="sm" leftIcon="X" onClick={onClose}>Cancel</Button>
          <Button color="primary" size="sm" leftIcon="Check" onClick={() => { onSave(forecast, attire); onClose(); }}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
}

/* ── Day Row Card ───────────────────────────────────────────────── */
function DayForecastCard({
  day,
  onEdit,
}: {
  day: ItineraryDay;
  onEdit: () => void;
}) {
  const hasForecast = !!day.weather.forecast;
  const hasAttire   = !!day.weather.dressCode;

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', marginBottom: 8, overflow: 'hidden' }}>
      {/* Day header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.875rem', background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>
          <span style={{ color: '#4f46e5', marginRight: 6 }}>Day {day.day}:</span>
          {day.theme || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No theme set</span>}
        </p>
        <Button color="primary" variant="ghost" size="sm" leftIcon="Pencil" onClick={onEdit}
          style={{ fontSize: '0.72rem', padding: '3px 10px' }}>
          Edit
        </Button>
      </div>

      {/* Forecast + Attire rows */}
      <div style={{ padding: '0.75rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Forecast */}
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>☀️</span>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 2 }}>
              Forecast
            </span>
            <p style={{ margin: 0, fontSize: '0.8rem', color: hasForecast ? '#374151' : '#9ca3af', fontStyle: hasForecast ? 'normal' : 'italic', lineHeight: 1.5 }}>
              {hasForecast ? day.weather.forecast : 'No forecast added — click Edit'}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f0f0f0', margin: '2px 0' }} />

        {/* Attire */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Icon name="Shirt" size={14} style={{ color: '#4f46e5', flexShrink: 0, marginTop: 3 }} />
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 2 }}>
              Suggested Attire
            </span>
            <p style={{ margin: 0, fontSize: '0.8rem', color: hasAttire ? '#374151' : '#9ca3af', fontStyle: hasAttire ? 'normal' : 'italic', lineHeight: 1.5 }}>
              {hasAttire ? day.weather.dressCode : 'No attire suggestion added — click Edit'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ───────────────────────────────────────────────── */
export function SectionWeatherAttire() {
  const wa          = usePublishStore((s) => s.data.weatherAttire);
  const itinerary   = usePublishStore((s) => s.data.dailyItinerary);
  const updateWA    = usePublishStore((s) => s.updateSection);

  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);

  const saveDayWeather = (dayNum: number, forecast: string, attire: string) => {
    const updatedDays = itinerary.days.map((d) =>
      d.day === dayNum ? { ...d, weather: { forecast, dressCode: attire } } : d,
    );
    updateWA('dailyItinerary', { ...itinerary, days: updatedDays });
  };

  return (
    <div>

      {/* ── Overall Weather Outlook ── */}
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Overall Weather Outlook
      </p>
      <div style={{ marginBottom: '1.5rem' }}>
        <TextareaField
          label="General Weather Summary"
          variant="outlined"
          minRows={5}
          value={wa.climate}
          onChange={(e) => updateWA('weatherAttire', { ...wa, climate: e.target.value })}
        />
        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
          Describe the general climate, season, and what to expect.
        </p>
      </div>

      {/* ── Daily Forecast & Attire Header ── */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{
          display: 'inline-block', padding: '5px 14px', borderRadius: 20,
          background: '#4f46e5', color: '#fff',
          fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Daily Forecast &amp; Attire
        </span>
      </div>

      {/* ── Day cards ── */}
      {itinerary.days.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.82rem', border: '2px dashed #e5e7eb', borderRadius: 8 }}>
          <Icon name="CloudSun" size={28} style={{ display: 'block', margin: '0 auto 8px', color: '#d1d5db' }} />
          No days added yet — add days in the <strong>Daily Itinerary</strong> section first
        </div>
      ) : (
        itinerary.days.map((day) => (
          <DayForecastCard
            key={day.day}
            day={day}
            onEdit={() => setEditingDay(day)}
          />
        ))
      )}

      {/* ── Modal ── */}
      {editingDay && (
        <ForecastModal
          day={editingDay}
          onSave={(forecast, attire) => saveDayWeather(editingDay.day, forecast, attire)}
          onClose={() => setEditingDay(null)}
        />
      )}
    </div>
  );
}

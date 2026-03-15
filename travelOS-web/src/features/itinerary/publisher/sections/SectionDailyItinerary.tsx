'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/shared/components';
import { TextField, SelectField, TextareaField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { ItineraryDay, ActivityItem } from '../types/publish.types';
import './activity-card.css';

/* ── Constants ─────────────────────────────────────────────────── */
const TIME_SLOTS    = ['Morning', 'Late Morning', 'Afternoon', 'Late Afternoon', 'Evening', 'Night'];
const ACTIVITY_TYPES = ['Sightseeing', 'Dining', 'Culture', 'Outdoor', 'Shopping', 'Transfer', 'Adventure', 'Rest', 'Other'];
const TIME_COLORS: Record<string, string> = {
  'Morning':        '#f59e0b',
  'Late Morning':   '#f97316',
  'Afternoon':      '#3b82f6',
  'Late Afternoon': '#8b5cf6',
  'Evening':        '#ec4899',
  'Night':          '#1e293b',
};

const EMPTY_ACTIVITY: ActivityItem = {
  time: 'Morning', title: '', description: '', location: '',
  activityType: 'Sightseeing', latitude: 0, longitude: 0, cost: 0, currency: 'USD', tags: [],
};

/* ── Activity Modal ────────────────────────────────────────────── */
function ActivityModal({
  initial, onSave, onClose,
}: {
  initial: ActivityItem;
  onSave: (a: ActivityItem) => void;
  onClose: () => void;
}) {
  const [act, setAct] = useState<ActivityItem>({ ...initial });
  const set = (p: Partial<ActivityItem>) => setAct((a) => ({ ...a, ...p }));
  const mb = { marginBottom: '0.875rem' };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' };

  const modal = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 12, width: 500, maxWidth: '95vw',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
            {initial.title ? 'Edit Activity' : 'Add Activity'}
          </h3>
          <Button color="secondary" variant="ghost" size="xs" onClick={onClose} style={{ borderRadius: '50%', width: 28, height: 28, padding: 0 }}>
            <Icon name="X" size={14} />
          </Button>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={mb}>
            <SelectField label="Time" variant="outlined" size="xs" value={act.time} onChange={(e) => set({ time: e.target.value })}>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </SelectField>
          </div>
          <div style={mb}>
            <TextField label="Activity Title" variant="outlined" size="xs" startIcon="FileText" required
              value={act.title} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div style={mb}>
            <SelectField label="Type" variant="outlined" size="xs" value={act.activityType} onChange={(e) => set({ activityType: e.target.value })}>
              {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </SelectField>
          </div>
          <div style={mb}>
            <TextareaField label="Description" variant="outlined" size="sm" minRows={3}
              value={act.description} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div style={mb}>
            <TextField label="Location" variant="outlined" size="xs" startIcon="MapPin"
              value={act.location} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div style={{ ...mb, display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <TextField label="Cost" variant="outlined" size="xs" startIcon="DollarSign" type="number" min={0}
                value={act.cost || ''} onChange={(e) => set({ cost: +e.target.value })} />
            </div>
            <div style={{ flex: '0 0 70px' }}>
              <TextField label="CCY" variant="outlined" size="xs"
                value={act.currency} onChange={(e) => set({ currency: e.target.value })} />
            </div>
          </div>
          <div style={grid2}>
            <TextField label="Lat" variant="outlined" size="xs" type="number"
              value={act.latitude || ''} onChange={(e) => set({ latitude: +e.target.value })} />
            <TextField label="Lng" variant="outlined" size="xs" type="number"
              value={act.longitude || ''} onChange={(e) => set({ longitude: +e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0.875rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
          <Button color="secondary" variant="ghost" size="xs" leftIcon="X" onClick={onClose}>Cancel</Button>
          <Button color="primary" size="xs" leftIcon="Check" disabled={!act.title} onClick={() => { onSave(act); onClose(); }}>Save Changes</Button>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
}

/* ── Day Meta Edit Modal ───────────────────────────────────────── */
function DayMetaModal({
  day, onSave, onClose,
}: {
  day: ItineraryDay;
  onSave: (d: ItineraryDay) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<ItineraryDay>({ ...day, weather: { ...day.weather } });
  const set = (p: Partial<ItineraryDay>) => setLocal((d) => ({ ...d, ...p }));
  const mb = { marginBottom: '0.875rem' };

  const modal = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 12, width: 460, maxWidth: '95vw',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
            Edit Day {day.day} Details
          </h3>
          <Button color="secondary" variant="ghost" size="xs" onClick={onClose} style={{ borderRadius: '50%', width: 28, height: 28, padding: 0 }}>
            <Icon name="X" size={14} />
          </Button>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={mb}>
            <TextField label="Day Theme / Title" variant="outlined" size="xs" startIcon="Sun"
              value={local.theme} onChange={(e) => set({ theme: e.target.value })} />
          </div>
          <div style={mb}>
            <TextField label="Weather Forecast" variant="outlined" size="xs" startIcon="Cloud"
              value={local.weather.forecast}
              onChange={(e) => setLocal((d) => ({ ...d, weather: { ...d.weather, forecast: e.target.value } }))} />
          </div>
          <div style={mb}>
            <TextField label="Dress Code" variant="outlined" size="xs" startIcon="Shirt"
              value={local.weather.dressCode}
              onChange={(e) => setLocal((d) => ({ ...d, weather: { ...d.weather, dressCode: e.target.value } }))} />
          </div>
          <div>
            <TextareaField label="Day Notes" variant="outlined" size="sm" minRows={2}
              value={local.notes || ''}
              onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0.875rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
          <Button color="secondary" variant="ghost" size="xs" leftIcon="X" onClick={onClose}>Cancel</Button>
          <Button color="primary" size="xs" leftIcon="Check" onClick={() => { onSave(local); onClose(); }}>Save</Button>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
}

/* ── Day Editor ────────────────────────────────────────────────── */
function DayEditor({ day, onChange, onRemove }: { day: ItineraryDay; onChange: (d: ItineraryDay) => void; onRemove: () => void }) {
  const [open, setOpen]           = useState(true);
  const [actModal, setActModal]   = useState<{ idx: number | null }>({ idx: null });
  const [showActModal, setShowActModal] = useState(false);
  const [showMetaModal, setShowMetaModal] = useState(false);

  const openAddAct  = ()           => { setActModal({ idx: null }); setShowActModal(true); };
  const openEditAct = (i: number)  => { setActModal({ idx: i });    setShowActModal(true); };
  const closeActModal = ()         => setShowActModal(false);

  const saveActivity = (a: ActivityItem) => {
    if (actModal.idx === null) {
      onChange({ ...day, activities: [...day.activities, a] });
    } else {
      onChange({ ...day, activities: day.activities.map((x, j) => j === actModal.idx ? a : x) });
    }
  };
  const removeAct = (i: number) => onChange({ ...day, activities: day.activities.filter((_, j) => j !== i) });

  // Group activities by time slot
  const grouped: Record<string, { act: ActivityItem; idx: number }[]> = {};
  day.activities.forEach((act, idx) => {
    const key = act.time || 'Other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ act, idx });
  });
  const groupKeys = TIME_SLOTS.filter((t) => grouped[t]?.length).concat(
    Object.keys(grouped).filter((k) => !TIME_SLOTS.includes(k) && grouped[k]?.length)
  );

  return (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: 10, marginBottom: '0.875rem',
      background: '#fff', overflow: 'hidden',
    }}>
      {/* ── Day header row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0.75rem 1rem',
        background: open ? '#f8f9ff' : '#fff',
        borderBottom: open ? '1px solid #e5e7eb' : 'none',
        cursor: 'pointer',
      }}
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? 'ChevronDown' : 'ChevronRight'} size={15} style={{ color: '#6b7280', flexShrink: 0 }} />

        {/* Day number circle */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: '50%',
          background: '#4f46e5', color: '#fff',
          fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
        }}>
          {day.day}
        </span>

        {/* Theme title */}
        <span style={{
          flex: 1, fontSize: '0.875rem', fontWeight: 600, color: '#111827',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {day.theme || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No theme set</span>}
        </span>

        {/* Activity count badge */}
        {day.activities.length > 0 && (
          <span style={{
            background: '#ede9fe', color: '#4f46e5',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '2px 8px', borderRadius: 20, flexShrink: 0,
          }}>
            {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
          </span>
        )}

        {/* Edit day meta */}
        <button type="button"
          onClick={(e) => { e.stopPropagation(); setShowMetaModal(true); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f46e5', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <Icon name="Pencil" size={14} />
        </button>

        {/* Delete day */}
        <button type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <Icon name="Trash2" size={14} />
        </button>
      </div>

      {open && (
        <div style={{ padding: '0.875rem 1rem' }}>
          {/* ── Info card: 2×2 grid ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            border: '1px solid #e5e7eb', borderRadius: 8,
            background: '#fafafa', marginBottom: '0.875rem', overflow: 'hidden',
          }}>
            <InfoRow icon="Sun"      label="THEME"      value={day.theme}                empty="No theme set"    />
            <InfoRow icon="Cloud"    label="FORECAST"   value={day.weather.forecast}     empty="No forecast set" borderLeft />
            <InfoRow icon="Shirt"    label="DRESS CODE" value={day.weather.dressCode}    empty="No dress code set" divider />
            <InfoRow icon="FileText" label="NOTES"      value={day.notes}                empty="No notes"        divider borderLeft />
          </div>

          {/* ── Activities heading ── */}
          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#374151', marginBottom: 10 }}>
            Activities ({day.activities.length})
          </div>

          {/* ── Empty state ── */}
          {day.activities.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.25rem', color: '#9ca3af', fontSize: '0.8rem', border: '2px dashed #e5e7eb', borderRadius: 8, marginBottom: 10 }}>
              No activities yet — click &quot;Add Activity&quot; below
            </div>
          )}

          {/* ── Grouped activities ── */}
          {groupKeys.map((timeKey) => (
            <div key={timeKey} style={{ marginBottom: 10 }}>
              {/* Time badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 12px', borderRadius: 4,
                background: TIME_COLORS[timeKey] ?? '#6b7280',
                color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                <Icon name="Clock" size={10} />
                {timeKey}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {grouped[timeKey].map(({ act, idx }) => (
                  <ActivityCard
                    key={idx}
                    act={act}
                    onEdit={() => openEditAct(idx)}
                    onDelete={() => removeAct(idx)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* ── Add Activity — bottom of accordion ── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Button size="sm" color="primary" variant="outline" leftIcon="Plus" onClick={openAddAct}>
              Add Activity
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showActModal && (
        <ActivityModal
          initial={actModal.idx === null ? EMPTY_ACTIVITY : day.activities[actModal.idx]}
          onSave={saveActivity}
          onClose={closeActModal}
        />
      )}
      {showMetaModal && (
        <DayMetaModal
          day={day}
          onSave={(d) => onChange(d)}
          onClose={() => setShowMetaModal(false)}
        />
      )}
    </div>
  );
}

/* ── Info Row (inside day card) ────────────────────────────────── */
function InfoRow({ icon, label, value, empty, divider, borderLeft }: {
  icon: IconName; label: string; value?: string; empty?: string; divider?: boolean; borderLeft?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '0.6rem 0.875rem',
      borderTop: divider ? '1px solid #f0f0f0' : 'none',
      borderLeft: borderLeft ? '1px solid #f0f0f0' : 'none',
    }}>
      <Icon name={icon} size={13} style={{ color: '#6b7280', marginTop: 1, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: '0.82rem', color: value ? '#111827' : '#d1d5db', fontStyle: value ? 'normal' : 'italic' }}>
          {value || empty || '—'}
        </div>
      </div>
    </div>
  );
}

/* ── Activity Card ─────────────────────────────────────────────── */
function ActivityCard({ act, onEdit, onDelete }: {
  act: ActivityItem; onEdit: () => void; onDelete: () => void;
}) {
  const typeKey = (act.activityType || 'other').toLowerCase();
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', overflow: 'hidden', marginBottom: 6 }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Left accent bar */}
        <div className={`act-card__accent act-card__accent--${typeKey}`} style={{ width: 4, flexShrink: 0 }} />

        <div style={{ padding: '0.55rem 0.75rem', flex: 1, minWidth: 0 }}>
          {/* Row 1: Type badge + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: act.description || act.location || act.cost > 0 ? 3 : 0, minWidth: 0 }}>
            <span className={`act-card__type act-card__type--${typeKey}`} style={{ fontSize: '0.6rem', fontWeight: 800, padding: '1px 7px', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
              {act.activityType}
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {act.title || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Untitled</span>}
            </span>
          </div>

          {/* Row 3: Description */}
          {act.description && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: act.location || act.cost > 0 ? 3 : 0 }}>
              {act.description}
            </div>
          )}

          {/* Row 4: Location (left, long) + Price (right) */}
          {(act.location || act.cost > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              {act.location ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  <Icon name="MapPin" size={11} />{act.location}
                </span>
              ) : <span />}
              {act.cost > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: '#10b981', fontWeight: 700, flexShrink: 0 }}>
                  <Icon name="DollarSign" size={11} />{act.currency} {act.cost}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hover actions */}
      {hovered && (
        <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 4 }}>
          <button type="button" onClick={onEdit} title="Edit" style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #c4b5fd', background: '#f5f3ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
            <Icon name="Pencil" size={11} />
          </button>
          <button type="button" onClick={onDelete} title="Delete" style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <Icon name="Trash2" size={11} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Section ──────────────────────────────────────────────── */
export function SectionDailyItinerary() {
  const daily   = usePublishStore((s) => s.data.dailyItinerary);
  const update  = usePublishStore((s) => s.updateSection);
  const genInfo = usePublishStore((s) => s.data.generalInfo);

  const addDay = () => {
    const nextDay = daily.days.length + 1;
    update('dailyItinerary', {
      ...daily,
      days: [...daily.days, { day: nextDay, theme: '', activities: [], nearbyPlaces: [], weather: { forecast: '', dressCode: '' }, notes: '' }],
    });
  };
  const updateDay = (i: number, d: ItineraryDay) =>
    update('dailyItinerary', { ...daily, days: daily.days.map((x, j) => j === i ? d : x) });
  const removeDay = (i: number) =>
    update('dailyItinerary', { ...daily, days: daily.days.filter((_, j) => j !== i).map((d, j) => ({ ...d, day: j + 1 })) });

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <TextField label="Itinerary Title" variant="outlined" size="xs" startIcon="FileText"
          value={daily.title || genInfo.title}
          onChange={(e) => update('dailyItinerary', { ...daily, title: e.target.value })} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <TextareaField label="Overview Notes" variant="outlined" size="sm" minRows={2}
          value={daily.notes}
          onChange={(e) => update('dailyItinerary', { ...daily, notes: e.target.value })} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151' }}>
          {daily.days.length} Day{daily.days.length !== 1 ? 's' : ''}
        </span>
        {daily.days.length > 0 && (
          <Button color="primary" size="xs" leftIcon="Plus" onClick={addDay}>Add Day</Button>
        )}
      </div>

      {daily.days.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', minHeight: '160px', textAlign: 'center', padding: '2rem 2rem 1.5rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: 8 }}>
          <span>No days added yet. Click &quot;Add Day&quot; to start building the itinerary.</span>
          <Button color="primary" size="xs" leftIcon="Plus" onClick={addDay}>Add Day</Button>
        </div>
      )}

      {daily.days.map((day, i) => (
        <DayEditor key={i} day={day} onChange={(d) => updateDay(i, d)} onRemove={() => removeDay(i)} />
      ))}
    </div>
  );
}

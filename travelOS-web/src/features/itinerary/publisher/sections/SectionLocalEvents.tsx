'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, TextField, SelectField, TextareaField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { LocalEvent } from '../types/publish.types';

const EVENT_CATEGORIES = ['Festival', 'Concert', 'Market', 'Sports', 'Cultural', 'Religious', 'Food & Wine', 'Art', 'Nature', 'Other'];

const CATEGORY_COLORS: Record<string, string> = {
  Festival:   '#f59e0b',
  Concert:    '#8b5cf6',
  Market:     '#10b981',
  Sports:     '#3b82f6',
  Cultural:   '#ec4899',
  Religious:  '#6366f1',
  'Food & Wine': '#ef4444',
  Art:        '#14b8a6',
  Nature:     '#22c55e',
  Other:      '#6b7280',
};

const newEvent = (): LocalEvent => ({
  id: `ev_${Date.now()}`, name: '', description: '', date: '', venue: '',
  category: 'Festival', latitude: 0, longitude: 0, entryFee: 0, currency: 'USD', tags: [],
});

/* ── Event Modal ────────────────────────────────────────────────── */
function EventModal({
  initial, onSave, onClose,
}: {
  initial: LocalEvent;
  onSave: (e: LocalEvent) => void;
  onClose: () => void;
}) {
  const [item, setItem] = useState<LocalEvent>({ ...initial });
  const set = (p: Partial<LocalEvent>) => setItem((i) => ({ ...i, ...p }));
  const [tagDraft, setTagDraft] = useState('');
  const addTag = () => { if (tagDraft.trim()) { set({ tags: [...item.tags, tagDraft.trim()] }); setTagDraft(''); } };

  const g2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' };
  const mb = { marginBottom: '0.875rem' };

  const modal = (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 12, width: 520, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '1px solid #e5e7eb' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
            {initial.name ? 'Edit Event' : 'Add Event'}
          </h3>
          <Button color="secondary" variant="ghost" size="xs" onClick={onClose}
            style={{ borderRadius: '50%', width: 28, height: 28, padding: 0 }}>
            <Icon name="X" size={14} />
          </Button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem' }}>
          {/* Category + Name */}
          <div style={g2}>
            <SelectField label="Category" variant="outlined" size="xs" value={item.category}
              onChange={(e) => set({ category: e.target.value })}>
              {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectField>
            <TextField label="Date" variant="outlined" size="xs" type="date" startIcon="Calendar"
              value={item.date} onChange={(e) => set({ date: e.target.value })} />
          </div>

          <div style={mb}>
            <TextField label="Event Name" variant="outlined" size="xs" startIcon="Tag" required
              value={item.name} onChange={(e) => set({ name: e.target.value })} />
          </div>

          <div style={mb}>
            <TextareaField label="Description" variant="outlined" minRows={3}
              value={item.description} onChange={(e) => set({ description: e.target.value })} />
          </div>

          {/* Venue + Fee */}
          <div style={g2}>
            <TextField label="Venue" variant="outlined" size="xs" startIcon="MapPin"
              value={item.venue} onChange={(e) => set({ venue: e.target.value })} />
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1 }}>
                <TextField label="Entry Fee" variant="outlined" size="xs" type="number" startIcon="DollarSign" min={0}
                  value={item.entryFee || ''} onChange={(e) => set({ entryFee: +e.target.value })} />
              </div>
              <div style={{ flex: '0 0 72px' }}>
                <TextField label="CCY" variant="outlined" size="xs"
                  value={item.currency} onChange={(e) => set({ currency: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Lat / Lng */}
          <div style={{ ...g2, marginBottom: '0.875rem' }}>
            <TextField label="Latitude" variant="outlined" size="xs" type="number"
              value={item.latitude || ''} onChange={(e) => set({ latitude: +e.target.value })} />
            <TextField label="Longitude" variant="outlined" size="xs" type="number"
              value={item.longitude || ''} onChange={(e) => set({ longitude: +e.target.value })} />
          </div>

          {/* Tags */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tags
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
              {item.tags.map((t, i) => (
                <span key={i} style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #e5e7eb' }}>
                  {t}
                  <span style={{ cursor: 'pointer', color: '#ef4444', lineHeight: 1 }}
                    onClick={() => set({ tags: item.tags.filter((_, j) => j !== i) })}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ flex: 1 }}>
                <TextField label="Add tag and press Enter" variant="outlined" size="xs"
                  value={tagDraft} onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
              </div>
              <Button size="xs" color="secondary" onClick={addTag} type="button">
                <Icon name="Plus" size={12} />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0.875rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
          <Button color="secondary" variant="ghost" size="xs" leftIcon="X" onClick={onClose}>Cancel</Button>
          <Button color="primary" size="xs" leftIcon="Check" disabled={!item.name}
            onClick={() => { onSave(item); onClose(); }}>
            Save Event
          </Button>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
}

/* ── Event Display Card ─────────────────────────────────────────── */
function EventCard({ item, onEdit, onDelete }: {
  item: LocalEvent; onEdit: () => void; onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const badgeColor = CATEGORY_COLORS[item.category] ?? '#6b7280';

  return (
    <div
      style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', overflow: 'hidden', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ padding: '0.75rem 0.875rem' }}>
        {/* Row 1: Category badge + Event name + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <span style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 4, flexShrink: 0,
            background: badgeColor, color: '#fff',
            fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            {item.category}
          </span>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', flex: 1, lineHeight: 1.3, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unnamed event</span>}
          </span>
          {item.date && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.7rem', color: '#6b7280', flexShrink: 0 }}>
              <Icon name="Calendar" size={10} style={{ color: '#4f46e5' }} />
              {item.date}
            </span>
          )}
        </div>

        {/* Venue */}
        {item.venue && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#6b7280', marginBottom: 4 }}>
            <Icon name="MapPin" size={11} style={{ flexShrink: 0, color: '#4f46e5' }} />
            {item.venue}
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p style={{ margin: '4px 0', fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.5 }}>
            {item.description.length > 80 ? item.description.slice(0, 80) + '…' : item.description}
          </p>
        )}

        {/* Fee + tags */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 10px', marginTop: 5 }}>
          {item.entryFee > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
              <Icon name="DollarSign" size={10} />
              {item.currency} {item.entryFee}
            </span>
          )}
          {item.tags.slice(0, 3).map((t) => (
            <span key={t} style={{ padding: '1px 7px', borderRadius: 20, fontSize: '0.62rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>
              {t}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span style={{ padding: '1px 7px', borderRadius: 20, fontSize: '0.62rem', background: '#ede9fe', color: '#4f46e5' }}>
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover: Edit / Delete */}
      {hovered && (
        <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 4 }}>
          <button onClick={onEdit} title="Edit" style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #c4b5fd', background: '#f5f3ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
            <Icon name="Pencil" size={11} />
          </button>
          <button onClick={onDelete} title="Delete" style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <Icon name="Trash2" size={11} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Section ───────────────────────────────────────────────── */
export function SectionLocalEvents() {
  const events = usePublishStore((s) => s.data.localEvents);
  const update = usePublishStore((s) => s.updateSection);

  const [modal, setModal] = useState<{ idx: number | null }>({ idx: null });
  const [showModal, setShowModal] = useState(false);

  const openAdd  = ()           => { setModal({ idx: null }); setShowModal(true); };
  const openEdit = (i: number)  => { setModal({ idx: i });    setShowModal(true); };
  const closeModal = ()         => setShowModal(false);

  const saveEvent = (item: LocalEvent) => {
    if (modal.idx === null) {
      update('localEvents', [...events, item]);
    } else {
      update('localEvents', events.map((x, j) => j === modal.idx ? item : x));
    }
  };
  const remove = (i: number) => update('localEvents', events.filter((_, j) => j !== i));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151' }}>
          {events.length} Event{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: 8, marginBottom: 10 }}>
          No events added yet — click &quot;Add Event&quot; below
        </div>
      )}

      {/* Event cards — 2 per row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {events.map((event, i) => (
          <EventCard key={event.id} item={event} onEdit={() => openEdit(i)} onDelete={() => remove(i)} />
        ))}
      </div>

      {/* Add Event — bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <Button color="primary" variant="outline" size="sm" leftIcon="Plus" onClick={openAdd}>
          Add Event
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <EventModal
          initial={modal.idx === null ? newEvent() : events[modal.idx]}
          onSave={saveEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

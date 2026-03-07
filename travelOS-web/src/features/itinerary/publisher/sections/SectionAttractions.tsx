'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, TextField, SelectField, TextareaField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { Attraction } from '../types/publish.types';

const CATEGORIES = ['Historical', 'Natural', 'Cultural', 'Adventure', 'Beach', 'Museum', 'Park', 'Religious', 'Shopping', 'Viewpoint', 'Other'];

const CATEGORY_COLORS: Record<string, string> = {
  Historical:  '#b45309',
  Natural:     '#16a34a',
  Cultural:    '#7c3aed',
  Adventure:   '#ea580c',
  Beach:       '#0284c7',
  Museum:      '#6d28d9',
  Park:        '#15803d',
  Religious:   '#a16207',
  Shopping:    '#db2777',
  Viewpoint:   '#0891b2',
  Other:       '#6b7280',
};

const newAttraction = (): Attraction => ({
  id: `att_${Date.now()}`, name: '', description: '', category: 'Historical',
  latitude: 0, longitude: 0, estimatedCost: 0, currency: 'USD',
  estimatedDuration: '', rating: 4, tags: [], imageQuery: '',
});

/* ── Attraction Modal ───────────────────────────────────────────── */
function AttractionModal({
  initial, onSave, onClose,
}: {
  initial: Attraction;
  onSave: (v: Attraction) => void;
  onClose: () => void;
}) {
  const [item, setItem] = useState<Attraction>({ ...initial });
  const set = (p: Partial<Attraction>) => setItem((i) => ({ ...i, ...p }));
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
            {initial.name ? 'Edit Place' : 'Add Place'}
          </h3>
          <Button color="secondary" variant="ghost" size="sm" onClick={onClose}
            style={{ borderRadius: '50%', width: 28, height: 28, padding: 0 }}>
            <Icon name="X" size={14} />
          </Button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem' }}>
          {/* Category + Rating */}
          <div style={g2}>
            <SelectField label="Category" variant="outlined" size="sm" value={item.category}
              onChange={(e) => set({ category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectField>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280' }}>Rating</span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', paddingTop: 4 }}>
                {[1,2,3,4,5].map((s) => (
                  <span key={s} onClick={() => set({ rating: s })} style={{
                    cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1,
                    color: s <= item.rating ? '#f59e0b' : '#d1d5db',
                    transition: 'color 0.1s',
                  }}>★</span>
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div style={mb}>
            <TextField label="Place / Attraction Name" variant="outlined" size="sm" startIcon="MapPin" required
              value={item.name} onChange={(e) => set({ name: e.target.value })} />
          </div>

          {/* Description */}
          <div style={mb}>
            <TextareaField label="Description" variant="outlined" minRows={3}
              value={item.description} onChange={(e) => set({ description: e.target.value })} />
          </div>

          {/* Duration + Cost */}
          <div style={g2}>
            <TextField label="Estimated Duration" variant="outlined" size="sm" startIcon="Clock"
              placeholder="e.g. 2-3 hours"
              value={item.estimatedDuration} onChange={(e) => set({ estimatedDuration: e.target.value })} />
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1 }}>
                <TextField label="Entry Cost" variant="outlined" size="sm" type="number" startIcon="DollarSign" min={0}
                  value={item.estimatedCost || ''} onChange={(e) => set({ estimatedCost: +e.target.value })} />
              </div>
              <div style={{ flex: '0 0 72px' }}>
                <TextField label="CCY" variant="outlined" size="sm"
                  value={item.currency} onChange={(e) => set({ currency: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Lat / Lng */}
          <div style={g2}>
            <TextField label="Latitude" variant="outlined" size="sm" type="number"
              value={item.latitude || ''} onChange={(e) => set({ latitude: +e.target.value })} />
            <TextField label="Longitude" variant="outlined" size="sm" type="number"
              value={item.longitude || ''} onChange={(e) => set({ longitude: +e.target.value })} />
          </div>

          {/* Image Query */}
          <div style={mb}>
            <TextField label="Image Search Query" variant="outlined" size="sm" startIcon="Search"
              value={item.imageQuery} onChange={(e) => set({ imageQuery: e.target.value })} />
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
                <TextField label="Add tag and press Enter" variant="outlined" size="sm"
                  value={tagDraft} onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
              </div>
              <Button size="sm" color="secondary" onClick={addTag} type="button">
                <Icon name="Plus" size={12} />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0.875rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
          <Button color="secondary" variant="ghost" size="sm" leftIcon="X" onClick={onClose}>Cancel</Button>
          <Button color="primary" size="sm" leftIcon="Check" disabled={!item.name}
            onClick={() => { onSave(item); onClose(); }}>
            Save Place
          </Button>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
}

/* ── Attraction Display Card ────────────────────────────────────── */
function AttractionCard({ item, onEdit, onDelete }: {
  item: Attraction; onEdit: () => void; onDelete: () => void;
}) {
  const badgeColor = CATEGORY_COLORS[item.category] ?? '#6b7280';

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 0.875rem' }}>
        {/* Category badge + stars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 4,
            background: badgeColor, color: '#fff',
            fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            {item.category}
          </span>
          <span style={{ color: '#f59e0b', fontSize: '0.82rem', letterSpacing: 1 }}>
            {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
          </span>
        </div>

        {/* Name */}
        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.875rem', color: '#111827', lineHeight: 1.3 }}>
          {item.name || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unnamed place</span>}
        </p>

        {/* Description */}
        {item.description && (
          <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
            {item.description.length > 100 ? item.description.slice(0, 100) + '…' : item.description}
          </p>
        )}

        {/* Duration + Cost */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginBottom: 6 }}>
          {item.estimatedDuration && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#6b7280' }}>
              <Icon name="Clock" size={11} style={{ color: '#4f46e5' }} />
              {item.estimatedDuration}
            </span>
          )}
          {item.estimatedCost > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#6b7280' }}>
              <Icon name="DollarSign" size={11} />
              {item.currency} {item.estimatedCost}
            </span>
          )}
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {item.tags.slice(0, 4).map((t) => (
              <span key={t} style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>
                {t}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', background: '#ede9fe', color: '#4f46e5' }}>
                +{item.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Edit / Delete */}
      <div style={{ display: 'flex', borderTop: '1px solid #f0f0f0' }}>
        <Button color="primary" variant="ghost" size="sm" leftIcon="Pencil" onClick={onEdit}
          style={{ flex: 1, borderRadius: 0, borderRight: '1px solid #f0f0f0', justifyContent: 'center', fontSize: '0.75rem' }}>
          Edit
        </Button>
        <Button color="danger" variant="ghost" size="sm" leftIcon="Trash2" onClick={onDelete}
          style={{ flex: 1, borderRadius: 0, justifyContent: 'center', fontSize: '0.75rem' }}>
          Delete
        </Button>
      </div>
    </div>
  );
}

/* ── Main Section ───────────────────────────────────────────────── */
export function SectionAttractions() {
  const items  = usePublishStore((s) => s.data.attractions);
  const update = usePublishStore((s) => s.updateSection);

  const [modal, setModal] = useState<{ idx: number | null }>({ idx: null });
  const [showModal, setShowModal] = useState(false);

  const openAdd  = ()           => { setModal({ idx: null }); setShowModal(true); };
  const openEdit = (i: number)  => { setModal({ idx: i });    setShowModal(true); };
  const closeModal = ()         => setShowModal(false);

  const saveItem = (item: Attraction) => {
    if (modal.idx === null) {
      update('attractions', [...items, item]);
    } else {
      update('attractions', items.map((x, j) => j === modal.idx ? item : x));
    }
  };
  const remove = (i: number) => update('attractions', items.filter((_, j) => j !== i));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151' }}>
          {items.length} Place{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: 8, marginBottom: 10 }}>
          No places added yet — click &quot;Add Place&quot; below
        </div>
      )}

      {/* Attraction cards */}
      {items.map((item, i) => (
        <AttractionCard key={item.id} item={item} onEdit={() => openEdit(i)} onDelete={() => remove(i)} />
      ))}

      {/* Add Place — bottom */}
      <Button color="primary" variant="outline" size="sm" leftIcon="Plus" onClick={openAdd}
        style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
        Add Place
      </Button>

      {/* Modal */}
      {showModal && (
        <AttractionModal
          initial={modal.idx === null ? newAttraction() : items[modal.idx]}
          onSave={saveItem}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

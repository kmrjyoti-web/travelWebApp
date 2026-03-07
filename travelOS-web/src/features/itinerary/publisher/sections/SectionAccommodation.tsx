'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, TextField, SelectField, TextareaField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { AccommodationItem } from '../types/publish.types';

/* ── Constants ─────────────────────────────────────────────────── */
const TYPES: AccommodationItem['type'][] = ['hotel', 'resort', 'hostel', 'villa', 'airbnb', 'other'];
const FACILITIES = ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Airport Shuttle', 'Beach Access', 'Room Service'];

const TYPE_COLORS: Record<string, string> = {
  hotel:   '#3b82f6',
  resort:  '#8b5cf6',
  hostel:  '#f59e0b',
  villa:   '#10b981',
  airbnb:  '#ec4899',
  other:   '#6b7280',
};

const newItem = (): AccommodationItem => ({
  id: `acc_${Date.now()}`, type: 'hotel', hotelName: '', checkInDate: '', checkOutDate: '',
  price: 0, currency: 'USD', rating: 3, roomType: '', facilities: [], notes: '',
});

/* ── Hotel Modal ───────────────────────────────────────────────── */
function HotelModal({
  initial, onSave, onClose,
}: {
  initial: AccommodationItem;
  onSave: (a: AccommodationItem) => void;
  onClose: () => void;
}) {
  const [item, setItem] = useState<AccommodationItem>({ ...initial });
  const set = (p: Partial<AccommodationItem>) => setItem((i) => ({ ...i, ...p }));
  const mb = { marginBottom: '0.875rem' };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' };

  const toggleFacility = (f: string) => {
    const facilities = item.facilities.includes(f)
      ? item.facilities.filter((x) => x !== f)
      : [...item.facilities, f];
    set({ facilities });
  };

  const modal = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 12, width: 520, maxWidth: '95vw',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '1px solid #e5e7eb',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
            {initial.hotelName ? 'Edit Hotel' : 'Add Hotel'}
          </h3>
          <Button color="secondary" variant="ghost" size="sm" onClick={onClose}
            style={{ borderRadius: '50%', width: 28, height: 28, padding: 0 }}>
            <Icon name="X" size={14} />
          </Button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem' }}>
          {/* Type + Name */}
          <div style={{ ...grid2, marginBottom: '0.875rem' }}>
            <SelectField label="Property Type" variant="outlined" size="sm" value={item.type}
              onChange={(e) => set({ type: e.target.value as AccommodationItem['type'] })}>
              {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </SelectField>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280' }}>Star Rating</span>
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

          <div style={mb}>
            <TextField label="Hotel / Property Name" variant="outlined" size="sm" startIcon="Tag" required
              value={item.hotelName} onChange={(e) => set({ hotelName: e.target.value })} />
          </div>

          {/* Check-in / Check-out */}
          <div style={{ ...grid2, ...mb }}>
            <TextField label="Check-in Date" variant="outlined" size="sm" type="date" startIcon="Calendar"
              value={item.checkInDate} onChange={(e) => set({ checkInDate: e.target.value })} />
            <TextField label="Check-out Date" variant="outlined" size="sm" type="date" startIcon="Calendar"
              value={item.checkOutDate} onChange={(e) => set({ checkOutDate: e.target.value })} />
          </div>

          {/* Room + Price */}
          <div style={{ ...grid2, ...mb }}>
            <TextField label="Room Type" variant="outlined" size="sm" startIcon="Tag"
              value={item.roomType} onChange={(e) => set({ roomType: e.target.value })} />
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1 }}>
                <TextField label="Price / Night" variant="outlined" size="sm" type="number" startIcon="DollarSign" min={0}
                  value={item.price || ''} onChange={(e) => set({ price: +e.target.value })} />
              </div>
              <div style={{ flex: '0 0 72px' }}>
                <TextField label="CCY" variant="outlined" size="sm"
                  value={item.currency} onChange={(e) => set({ currency: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div style={mb}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Facilities
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FACILITIES.map((f) => (
                <span key={f} onClick={() => toggleFacility(f)} style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', cursor: 'pointer',
                  fontWeight: item.facilities.includes(f) ? 600 : 400,
                  background: item.facilities.includes(f) ? '#4f46e5' : '#f3f4f6',
                  color: item.facilities.includes(f) ? '#fff' : '#374151',
                  border: `1px solid ${item.facilities.includes(f) ? '#4f46e5' : '#e5e7eb'}`,
                  transition: 'all 0.12s',
                }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <TextareaField label="Notes" variant="outlined" size="sm" minRows={2}
            value={item.notes} onChange={(e) => set({ notes: e.target.value })} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0.875rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
          <Button color="secondary" variant="ghost" size="sm" leftIcon="X" onClick={onClose}>Cancel</Button>
          <Button color="primary" size="sm" leftIcon="Check" disabled={!item.hotelName}
            onClick={() => { onSave(item); onClose(); }}>
            Save Hotel
          </Button>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
}

/* ── Hotel Display Card ────────────────────────────────────────── */
function HotelCard({ item, onEdit, onDelete }: {
  item: AccommodationItem; onEdit: () => void; onDelete: () => void;
}) {
  const typeColor = TYPE_COLORS[item.type] ?? '#6b7280';
  const nights = item.checkInDate && item.checkOutDate
    ? Math.max(0, Math.round((new Date(item.checkOutDate).getTime() - new Date(item.checkInDate).getTime()) / 86400000))
    : null;

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 0.875rem' }}>
        {/* Type badge + stars row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 4,
            background: typeColor, color: '#fff',
            fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            {item.type}
          </span>
          <span style={{ color: '#f59e0b', fontSize: '0.82rem', letterSpacing: 1 }}>
            {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
          </span>
        </div>

        {/* Hotel name */}
        <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '0.875rem', color: '#111827', lineHeight: 1.3 }}>
          {item.hotelName || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unnamed property</span>}
        </p>

        {/* Room type */}
        {item.roomType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>
            <Icon name="BedDouble" size={12} style={{ flexShrink: 0 }} />
            {item.roomType}
          </div>
        )}

        {/* Dates */}
        {(item.checkInDate || item.checkOutDate) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>
            <Icon name="Calendar" size={12} style={{ flexShrink: 0, color: '#4f46e5' }} />
            {item.checkInDate || '—'} → {item.checkOutDate || '—'}
            {nights !== null && nights > 0 && (
              <span style={{ background: '#ede9fe', color: '#4f46e5', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: 10, marginLeft: 4 }}>
                {nights} night{nights !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        {item.price > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>
            <Icon name="DollarSign" size={12} style={{ flexShrink: 0 }} />
            {item.currency} {item.price} / night
          </div>
        )}

        {/* Facilities chips */}
        {item.facilities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {item.facilities.slice(0, 5).map((f) => (
              <span key={f} style={{
                padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem',
                background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb',
              }}>{f}</span>
            ))}
            {item.facilities.length > 5 && (
              <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', background: '#ede9fe', color: '#4f46e5' }}>
                +{item.facilities.length - 5} more
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

/* ── Main Section ──────────────────────────────────────────────── */
export function SectionAccommodation() {
  const items  = usePublishStore((s) => s.data.accommodation);
  const update = usePublishStore((s) => s.updateSection);

  const [modal, setModal] = useState<{ idx: number | null }>({ idx: null });
  const [showModal, setShowModal] = useState(false);

  const openAdd  = ()           => { setModal({ idx: null }); setShowModal(true); };
  const openEdit = (i: number)  => { setModal({ idx: i });    setShowModal(true); };
  const closeModal = ()         => setShowModal(false);

  const saveHotel = (item: AccommodationItem) => {
    if (modal.idx === null) {
      update('accommodation', [...items, item]);
    } else {
      update('accommodation', items.map((x, j) => j === modal.idx ? item : x));
    }
  };
  const remove = (i: number) => update('accommodation', items.filter((_, j) => j !== i));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151' }}>
          {items.length} Hotel{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: 8, marginBottom: 10 }}>
          No hotels added yet — click &quot;Add Hotel&quot; below
        </div>
      )}

      {/* Hotel cards */}
      {items.map((item, i) => (
        <HotelCard key={item.id} item={item} onEdit={() => openEdit(i)} onDelete={() => remove(i)} />
      ))}

      {/* Add Hotel — bottom */}
      <Button color="primary" variant="outline" size="sm" leftIcon="Plus" onClick={openAdd}
        style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
        Add Hotel
      </Button>

      {/* Modal */}
      {showModal && (
        <HotelModal
          initial={modal.idx === null ? newItem() : items[modal.idx]}
          onSave={saveHotel}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

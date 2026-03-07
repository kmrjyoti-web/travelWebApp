'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, TextField, SelectField, TextareaField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { FlightSegment, TrainSegment, OtherTransport } from '../types/publish.types';

/* ── Constants ─────────────────────────────────────────────────── */
const FLIGHT_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First'];
const TRAIN_CLASSES  = ['General', 'Sleeper', 'AC 3-Tier', 'AC 2-Tier', 'First AC'];
type Tab = 'flights' | 'trains' | 'other';

const newFlight = (): FlightSegment => ({ id: `fl_${Date.now()}`, airline: '', flightNumber: '', from: '', to: '', departureDate: '', departureTime: '', arrivalTime: '', classType: 'Economy', price: 0, currency: 'USD', notes: '' });
const newTrain  = (): TrainSegment  => ({ id: `tr_${Date.now()}`, trainName: '', trainNumber: '', from: '', to: '', departureDate: '', departureTime: '', arrivalTime: '', classType: 'AC 3-Tier', price: 0, currency: 'USD', notes: '' });
const newOther  = (): OtherTransport => ({ id: `ot_${Date.now()}`, type: '', description: '', from: '', to: '', date: '', price: 0, currency: 'USD', notes: '' });

/* ── Shared modal shell ────────────────────────────────────────── */
function ModalShell({ title, onClose, onSave, saveDisabled, children }: {
  title: string; onClose: () => void; onSave: () => void; saveDisabled?: boolean; children: React.ReactNode;
}) {
  const modal = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: 12, width: 540, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '1px solid #e5e7eb' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>{title}</h3>
          <Button color="secondary" variant="ghost" size="sm" onClick={onClose} style={{ borderRadius: '50%', width: 28, height: 28, padding: 0 }}>
            <Icon name="X" size={14} />
          </Button>
        </div>
        {/* Body */}
        <div style={{ padding: '1.25rem' }}>{children}</div>
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0.875rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
          <Button color="secondary" variant="ghost" size="sm" leftIcon="X" onClick={onClose}>Cancel</Button>
          <Button color="primary" size="sm" leftIcon="Check" disabled={saveDisabled} onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
}

/* ── Flight Modal ──────────────────────────────────────────────── */
function FlightModal({ initial, onSave, onClose }: { initial: FlightSegment; onSave: (v: FlightSegment) => void; onClose: () => void }) {
  const [item, setItem] = useState<FlightSegment>({ ...initial });
  const set = (p: Partial<FlightSegment>) => setItem((i) => ({ ...i, ...p }));
  const mb = { marginBottom: '0.875rem' };
  const g2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' };
  const g3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' };

  return (
    <ModalShell title={initial.airline ? 'Edit Flight' : 'Add Flight'} onClose={onClose}
      saveDisabled={!item.airline && !item.flightNumber}
      onSave={() => { onSave(item); onClose(); }}>
      <div style={g3}>
        <TextField label="Airline" variant="outlined" size="sm" startIcon="Tag" value={item.airline} onChange={(e) => set({ airline: e.target.value })} />
        <TextField label="Flight No." variant="outlined" size="sm" value={item.flightNumber} onChange={(e) => set({ flightNumber: e.target.value })} />
        <SelectField label="Class" variant="outlined" size="sm" value={item.classType} onChange={(e) => set({ classType: e.target.value })}>
          {FLIGHT_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </SelectField>
      </div>
      <div style={g2}>
        <TextField label="From" variant="outlined" size="sm" startIcon="MapPin" value={item.from} onChange={(e) => set({ from: e.target.value })} />
        <TextField label="To" variant="outlined" size="sm" startIcon="MapPin" value={item.to} onChange={(e) => set({ to: e.target.value })} />
      </div>
      <div style={g3}>
        <TextField label="Departure Date" variant="outlined" size="sm" type="date" startIcon="Calendar" value={item.departureDate} onChange={(e) => set({ departureDate: e.target.value })} />
        <TextField label="Dep Time" variant="outlined" size="sm" type="time" value={item.departureTime} onChange={(e) => set({ departureTime: e.target.value })} />
        <TextField label="Arr Time" variant="outlined" size="sm" type="time" value={item.arrivalTime} onChange={(e) => set({ arrivalTime: e.target.value })} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', ...mb }}>
        <div style={{ flex: 1 }}>
          <TextField label="Price" variant="outlined" size="sm" type="number" startIcon="DollarSign" min={0} value={item.price || ''} onChange={(e) => set({ price: +e.target.value })} />
        </div>
        <div style={{ flex: '0 0 72px' }}>
          <TextField label="CCY" variant="outlined" size="sm" value={item.currency} onChange={(e) => set({ currency: e.target.value })} />
        </div>
      </div>
      <TextareaField label="Notes" variant="outlined" size="sm" minRows={2} value={item.notes} onChange={(e) => set({ notes: e.target.value })} />
    </ModalShell>
  );
}

/* ── Train Modal ───────────────────────────────────────────────── */
function TrainModal({ initial, onSave, onClose }: { initial: TrainSegment; onSave: (v: TrainSegment) => void; onClose: () => void }) {
  const [item, setItem] = useState<TrainSegment>({ ...initial });
  const set = (p: Partial<TrainSegment>) => setItem((i) => ({ ...i, ...p }));
  const mb = { marginBottom: '0.875rem' };
  const g2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' };
  const g3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' };

  return (
    <ModalShell title={initial.trainName ? 'Edit Train' : 'Add Train'} onClose={onClose}
      saveDisabled={!item.trainName && !item.trainNumber}
      onSave={() => { onSave(item); onClose(); }}>
      <div style={g3}>
        <TextField label="Train Name" variant="outlined" size="sm" startIcon="Tag" value={item.trainName} onChange={(e) => set({ trainName: e.target.value })} />
        <TextField label="Train No." variant="outlined" size="sm" value={item.trainNumber} onChange={(e) => set({ trainNumber: e.target.value })} />
        <SelectField label="Class" variant="outlined" size="sm" value={item.classType} onChange={(e) => set({ classType: e.target.value })}>
          {TRAIN_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </SelectField>
      </div>
      <div style={g2}>
        <TextField label="From" variant="outlined" size="sm" startIcon="MapPin" value={item.from} onChange={(e) => set({ from: e.target.value })} />
        <TextField label="To" variant="outlined" size="sm" startIcon="MapPin" value={item.to} onChange={(e) => set({ to: e.target.value })} />
      </div>
      <div style={g3}>
        <TextField label="Departure Date" variant="outlined" size="sm" type="date" startIcon="Calendar" value={item.departureDate} onChange={(e) => set({ departureDate: e.target.value })} />
        <TextField label="Dep Time" variant="outlined" size="sm" type="time" value={item.departureTime} onChange={(e) => set({ departureTime: e.target.value })} />
        <TextField label="Arr Time" variant="outlined" size="sm" type="time" value={item.arrivalTime} onChange={(e) => set({ arrivalTime: e.target.value })} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', ...mb }}>
        <div style={{ flex: 1 }}>
          <TextField label="Price" variant="outlined" size="sm" type="number" startIcon="DollarSign" min={0} value={item.price || ''} onChange={(e) => set({ price: +e.target.value })} />
        </div>
        <div style={{ flex: '0 0 72px' }}>
          <TextField label="CCY" variant="outlined" size="sm" value={item.currency} onChange={(e) => set({ currency: e.target.value })} />
        </div>
      </div>
      <TextareaField label="Notes" variant="outlined" size="sm" minRows={2} value={item.notes} onChange={(e) => set({ notes: e.target.value })} />
    </ModalShell>
  );
}

/* ── Other Modal ───────────────────────────────────────────────── */
function OtherModal({ initial, onSave, onClose }: { initial: OtherTransport; onSave: (v: OtherTransport) => void; onClose: () => void }) {
  const [item, setItem] = useState<OtherTransport>({ ...initial });
  const set = (p: Partial<OtherTransport>) => setItem((i) => ({ ...i, ...p }));
  const mb = { marginBottom: '0.875rem' };
  const g2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' };

  return (
    <ModalShell title={initial.type ? 'Edit Transport' : 'Add Transport'} onClose={onClose}
      saveDisabled={!item.type}
      onSave={() => { onSave(item); onClose(); }}>
      <div style={g2}>
        <TextField label="Transport Type" variant="outlined" size="sm" startIcon="Tag" required value={item.type} onChange={(e) => set({ type: e.target.value })} />
        <TextField label="Date" variant="outlined" size="sm" type="date" startIcon="Calendar" value={item.date} onChange={(e) => set({ date: e.target.value })} />
      </div>
      <div style={g2}>
        <TextField label="From" variant="outlined" size="sm" startIcon="MapPin" value={item.from} onChange={(e) => set({ from: e.target.value })} />
        <TextField label="To" variant="outlined" size="sm" startIcon="MapPin" value={item.to} onChange={(e) => set({ to: e.target.value })} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', ...mb }}>
        <div style={{ flex: 1 }}>
          <TextField label="Price" variant="outlined" size="sm" type="number" startIcon="DollarSign" min={0} value={item.price || ''} onChange={(e) => set({ price: +e.target.value })} />
        </div>
        <div style={{ flex: '0 0 72px' }}>
          <TextField label="CCY" variant="outlined" size="sm" value={item.currency} onChange={(e) => set({ currency: e.target.value })} />
        </div>
      </div>
      <div style={mb}>
        <TextareaField label="Description" variant="outlined" size="sm" minRows={2} value={item.description} onChange={(e) => set({ description: e.target.value })} />
      </div>
      <TextareaField label="Notes" variant="outlined" size="sm" minRows={2} value={item.notes} onChange={(e) => set({ notes: e.target.value })} />
    </ModalShell>
  );
}

/* ── Transport display card ────────────────────────────────────── */
function TransportCard({ icon, badge, badgeColor, title, subtitle, meta, onEdit, onDelete }: {
  icon: React.ReactNode; badge: string; badgeColor: string;
  title: string; subtitle?: string; meta: { icon: React.ReactNode; text: string }[];
  onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 10px', borderRadius: 4, background: badgeColor, color: '#fff', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            {icon}{badge}
          </span>
        </div>
        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.875rem', color: '#111827', lineHeight: 1.3 }}>
          {title || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unnamed</span>}
        </p>
        {subtitle && <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#6b7280' }}>{subtitle}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 4 }}>
          {meta.filter((m) => m.text).map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#6b7280' }}>
              {m.icon}{m.text}
            </div>
          ))}
        </div>
      </div>
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

/* ── Tab list ──────────────────────────────────────────────────── */
type ModalState = { type: Tab; idx: number | null } | null;

/* ── Main Section ──────────────────────────────────────────────── */
export function SectionTransportation() {
  const transport = usePublishStore((s) => s.data.transportation);
  const update    = usePublishStore((s) => s.updateSection);
  const [tab, setTab]       = useState<Tab>('flights');
  const [modal, setModal]   = useState<ModalState>(null);

  const openAdd  = (type: Tab)           => setModal({ type, idx: null });
  const openEdit = (type: Tab, i: number) => setModal({ type, idx: i });
  const closeModal = ()                  => setModal(null);

  const saveFlight = (v: FlightSegment) => {
    const list = modal?.idx === null ? [...transport.flights, v] : transport.flights.map((x, j) => j === modal?.idx ? v : x);
    update('transportation', { ...transport, flights: list });
  };
  const saveTrain = (v: TrainSegment) => {
    const list = modal?.idx === null ? [...transport.trains, v] : transport.trains.map((x, j) => j === modal?.idx ? v : x);
    update('transportation', { ...transport, trains: list });
  };
  const saveOther = (v: OtherTransport) => {
    const list = modal?.idx === null ? [...transport.other, v] : transport.other.map((x, j) => j === modal?.idx ? v : x);
    update('transportation', { ...transport, other: list });
  };

  const removeFlight = (i: number) => update('transportation', { ...transport, flights: transport.flights.filter((_, j) => j !== i) });
  const removeTrain  = (i: number) => update('transportation', { ...transport, trains:  transport.trains.filter((_, j) => j !== i) });
  const removeOther  = (i: number) => update('transportation', { ...transport, other:   transport.other.filter((_, j) => j !== i) });

  const tabs: { id: Tab; label: string; icon: string; count: number }[] = [
    { id: 'flights', label: 'Flights', icon: 'Plane',     count: transport.flights.length },
    { id: 'trains',  label: 'Trains',  icon: 'TrainFront', count: transport.trains.length },
    { id: 'other',   label: 'Other',   icon: 'BusFront',  count: transport.other.length },
  ];

  return (
    <div>
      {/* ── Tab pills — single line ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: '0.79rem', fontWeight: tab === t.id ? 700 : 500,
            background: tab === t.id ? '#4f46e5' : '#f3f4f6',
            color: tab === t.id ? '#fff' : '#374151',
            transition: 'all 0.15s',
          }}>
            <Icon name={t.icon as 'Plane'} size={12} />
            {t.label}
            <span style={{
              background: tab === t.id ? 'rgba(255,255,255,0.25)' : '#e5e7eb',
              color: tab === t.id ? '#fff' : '#6b7280',
              fontSize: '0.65rem', fontWeight: 700,
              padding: '1px 6px', borderRadius: 10, marginLeft: 2,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Flights tab ── */}
      {tab === 'flights' && (
        <>
          {transport.flights.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.8rem', border: '2px dashed #e5e7eb', borderRadius: 8, marginBottom: 10 }}>
              No flights added — click &quot;Add Flight&quot; below
            </div>
          )}
          {transport.flights.map((f, i) => (
            <TransportCard key={f.id}
              icon={<Icon name="Plane" size={10} />}
              badge="Flight" badgeColor="#3b82f6"
              title={[f.airline, f.flightNumber].filter(Boolean).join(' · ') || 'Unnamed flight'}
              subtitle={f.classType}
              meta={[
                { icon: <Icon name="MapPin" size={11} />, text: f.from && f.to ? `${f.from} → ${f.to}` : '' },
                { icon: <Icon name="Calendar" size={11} />, text: f.departureDate },
                { icon: <Icon name="Clock" size={11} />, text: f.departureTime && f.arrivalTime ? `${f.departureTime} – ${f.arrivalTime}` : '' },
                { icon: <Icon name="DollarSign" size={11} />, text: f.price > 0 ? `${f.currency} ${f.price}` : '' },
              ]}
              onEdit={() => openEdit('flights', i)}
              onDelete={() => removeFlight(i)}
            />
          ))}
          <Button color="primary" variant="outline" size="sm" leftIcon="Plus" onClick={() => openAdd('flights')}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            Add Flight
          </Button>
        </>
      )}

      {/* ── Trains tab ── */}
      {tab === 'trains' && (
        <>
          {transport.trains.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.8rem', border: '2px dashed #e5e7eb', borderRadius: 8, marginBottom: 10 }}>
              No trains added — click &quot;Add Train&quot; below
            </div>
          )}
          {transport.trains.map((t, i) => (
            <TransportCard key={t.id}
              icon={<Icon name="TrainFront" size={10} />}
              badge="Train" badgeColor="#8b5cf6"
              title={[t.trainName, t.trainNumber].filter(Boolean).join(' · ') || 'Unnamed train'}
              subtitle={t.classType}
              meta={[
                { icon: <Icon name="MapPin" size={11} />, text: t.from && t.to ? `${t.from} → ${t.to}` : '' },
                { icon: <Icon name="Calendar" size={11} />, text: t.departureDate },
                { icon: <Icon name="Clock" size={11} />, text: t.departureTime && t.arrivalTime ? `${t.departureTime} – ${t.arrivalTime}` : '' },
                { icon: <Icon name="DollarSign" size={11} />, text: t.price > 0 ? `${t.currency} ${t.price}` : '' },
              ]}
              onEdit={() => openEdit('trains', i)}
              onDelete={() => removeTrain(i)}
            />
          ))}
          <Button color="primary" variant="outline" size="sm" leftIcon="Plus" onClick={() => openAdd('trains')}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            Add Train
          </Button>
        </>
      )}

      {/* ── Other tab ── */}
      {tab === 'other' && (
        <>
          {transport.other.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.8rem', border: '2px dashed #e5e7eb', borderRadius: 8, marginBottom: 10 }}>
              No other transport added — click &quot;Add Transport&quot; below
            </div>
          )}
          {transport.other.map((o, i) => (
            <TransportCard key={o.id}
              icon={<Icon name="BusFront" size={10} />}
              badge={o.type || 'Other'} badgeColor="#f59e0b"
              title={o.type || 'Unnamed transport'}
              subtitle={o.description}
              meta={[
                { icon: <Icon name="MapPin" size={11} />, text: o.from && o.to ? `${o.from} → ${o.to}` : '' },
                { icon: <Icon name="Calendar" size={11} />, text: o.date },
                { icon: <Icon name="DollarSign" size={11} />, text: o.price > 0 ? `${o.currency} ${o.price}` : '' },
              ]}
              onEdit={() => openEdit('other', i)}
              onDelete={() => removeOther(i)}
            />
          ))}
          <Button color="primary" variant="outline" size="sm" leftIcon="Plus" onClick={() => openAdd('other')}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            Add Transport
          </Button>
        </>
      )}

      {/* ── Modals ── */}
      {modal?.type === 'flights' && (
        <FlightModal
          initial={modal.idx === null ? newFlight() : transport.flights[modal.idx]}
          onSave={saveFlight} onClose={closeModal}
        />
      )}
      {modal?.type === 'trains' && (
        <TrainModal
          initial={modal.idx === null ? newTrain() : transport.trains[modal.idx]}
          onSave={saveTrain} onClose={closeModal}
        />
      )}
      {modal?.type === 'other' && (
        <OtherModal
          initial={modal.idx === null ? newOther() : transport.other[modal.idx]}
          onSave={saveOther} onClose={closeModal}
        />
      )}
    </div>
  );
}

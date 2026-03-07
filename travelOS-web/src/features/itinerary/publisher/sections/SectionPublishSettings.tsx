'use client';
import React, { useRef } from 'react';
import { TextField, SelectField, TextareaField, TagsInput, Switch, Checkbox } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { PublishSettings, PublishStatus } from '../types/publish.types';

/* ── Helpers ────────────────────────────────────────────────────── */
function Stepper({ value, onChange, min = 0, max = 99 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', height: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb' }}>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} style={{ flex: 1, background: '#f9fafb', border: 'none', cursor: 'pointer', padding: '0 10px', lineHeight: 1 }}>
          <Icon name="ChevronUp" size={12} style={{ color: '#6b7280' }} />
        </button>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} style={{ flex: 1, background: '#f9fafb', border: 'none', borderTop: '1px solid #e5e7eb', cursor: 'pointer', padding: '0 10px', lineHeight: 1 }}>
          <Icon name="ChevronDown" size={12} style={{ color: '#6b7280' }} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 12, fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{value}</div>
    </div>
  );
}

function Block({ title, children, extra, bg }: { title?: string; children: React.ReactNode; extra?: React.ReactNode; bg?: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: bg ?? '#fff', marginBottom: '1rem', overflow: 'hidden' }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{title}</span>
          {extra}
        </div>
      )}
      <div style={{ padding: '1rem' }}>{children}</div>
    </div>
  );
}

const STATUS_CONFIG = {
  draft:        { label: 'Draft',        color: '#6b7280', bg: '#f3f4f6', icon: 'FileEdit' },
  under_review: { label: 'Under Review', color: '#d97706', bg: '#fef3c7', icon: 'Clock' },
  published:    { label: 'Published',    color: '#059669', bg: '#d1fae5', icon: 'Globe' },
  unpublished:  { label: 'Unpublished',  color: '#dc2626', bg: '#fee2e2', icon: 'EyeOff' },
  archived:     { label: 'Archived',     color: '#6b7280', bg: '#f3f4f6', icon: 'Archive' },
} as const;

const RESET_FREQS = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
const LANGUAGES = ['English (Default)', 'Arabic', 'French', 'German', 'Spanish', 'Hindi', 'Japanese'];

/* ── Main Section ───────────────────────────────────────────────── */
export function SectionPublishSettings() {
  const ps     = usePublishStore((s) => s.data.publishSettings);
  const update = usePublishStore((s) => s.updateSection);
  const set    = (p: Partial<PublishSettings>) => update('publishSettings', { ...ps, ...p });

  const cardRef = useRef<HTMLInputElement>(null);

  const cfg = STATUS_CONFIG[ps.status]; void cfg;

  return (
    <div>

      {/* ── Status header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.875rem 1rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10 }}>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#111827' }}>Publish Settings</p>
          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>Configure how this package appears when published.</p>
        </div>
      </div>

      {/* ── Status selector ── */}
      <Block title="Package Status">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(Object.entries(STATUS_CONFIG) as [PublishSettings['status'], typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, val]) => (
            <span key={key} onClick={() => set({ status: key })} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', cursor: 'pointer',
              fontWeight: ps.status === key ? 700 : 400,
              background: ps.status === key ? val.bg : '#f9fafb',
              color: ps.status === key ? val.color : '#6b7280',
              border: `1px solid ${ps.status === key ? val.color + '80' : '#e5e7eb'}`,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name={val.icon as 'Globe'} size={13} />{val.label}
            </span>
          ))}
        </div>
      </Block>

      {/* ── Special Offer ── */}
      <div style={{ border: '1px solid #f5c6a0', borderRadius: 10, background: '#fff8f0', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderBottom: ps.specialOffer ? '1px solid #f5c6a060' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="Zap" size={16} style={{ color: '#c2410c' }} />
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#c2410c' }}>Special Offer</span>
          </div>
          <Switch checked={ps.specialOffer} onChange={(e) => set({ specialOffer: e.target.checked })} />
        </div>
        {ps.specialOffer && (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <TextField label="Offer Title" variant="outlined" size="sm" placeholder="e.g. Early Bird Special" value={ps.offerTitle} onChange={(e) => set({ offerTitle: e.target.value })} />
            <TextField label="Offer Heading" variant="outlined" size="sm" placeholder="e.g. Limited Time Deal!" value={ps.offerHeading} onChange={(e) => set({ offerHeading: e.target.value })} />
            <TextField label="Valid For / Until" variant="outlined" size="sm" type="date" value={ps.offerValidUntil} onChange={(e) => set({ offerValidUntil: e.target.value })} />
            <TextField label="Offer Tags" variant="outlined" size="sm" placeholder="e.g. newyear, christmas" value={ps.offerTags} onChange={(e) => set({ offerTags: e.target.value })} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid #f5c6a060' }}>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#c2410c' }}>Repeat Offer (Daily Reset)</span>
              <Switch checked={ps.repeatOfferDaily} onChange={(e) => set({ repeatOfferDaily: e.target.checked })} />
            </div>
          </div>
        )}
      </div>

      {/* ── Repeating Package ── */}
      <div style={{ border: '1px solid #c7d2fe', borderRadius: 10, background: '#eef2ff', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderBottom: ps.repeatingPackage ? '1px solid #c7d2fe60' : 'none' }}>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#3730a3' }}>Repeating Package</span>
          <Switch checked={ps.repeatingPackage} onChange={(e) => set({ repeatingPackage: e.target.checked })} />
        </div>
        {ps.repeatingPackage && (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <SelectField label="Reset Frequency" variant="outlined" size="sm" value={ps.resetFrequency} onChange={(e) => set({ resetFrequency: e.target.value as PublishSettings['resetFrequency'] })}>
              {RESET_FREQS.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
            </SelectField>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#4f46e5' }}>Package availability will automatically reset based on this frequency.</p>
          </div>
        )}
      </div>

      {/* ── Discovery & Tags ── */}
      <Block title="Discovery & Tags">
        <div style={{ marginBottom: '1rem' }}>
          <TagsInput label="Tags" value={ps.discoveryTags} onChange={(tags) => set({ discoveryTags: tags })} placeholder="Add tags (e.g. Summer, Beach, Adventure)" />
        </div>
        <div>
          <p style={{ margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>Itinerary Card Image</p>
          <div onClick={() => cardRef.current?.click()} style={{ border: '2px dashed #d1d5db', borderRadius: 8, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#f9fafb', marginBottom: 8 }}>
            {ps.cardImageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={ps.cardImageUrl} alt="Card" style={{ maxHeight: 120, borderRadius: 6, objectFit: 'cover' }} />
              : <>
                  <Icon name="Image" size={28} style={{ color: '#d1d5db', display: 'block', margin: '0 auto 8px' }} />
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af' }}>Click to upload card image</p>
                </>
            }
          </div>
          {/* hidden file input — no shared component for file pickers */}
          <input ref={cardRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) { const url = URL.createObjectURL(f); set({ cardImageUrl: url }); } }} />
          <TextField label="Or paste image URL" variant="outlined" size="sm" placeholder="https://..." value={ps.cardImageUrl} onChange={(e) => set({ cardImageUrl: e.target.value })} />
        </div>
      </Block>

      {/* ── Constraints ── */}
      <Block title="Constraints">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>Duration (Days)</p>
            <Stepper value={ps.durationDays} onChange={(v) => set({ durationDays: v })} min={1} />
          </div>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>Duration (Nights)</p>
            <Stepper value={ps.durationNights} onChange={(v) => set({ durationNights: v })} min={0} />
          </div>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>Travelers Min</p>
            <Stepper value={ps.travelersMin} onChange={(v) => set({ travelersMin: v })} min={1} />
          </div>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>Travelers Max</p>
            <Stepper value={ps.travelersMax} onChange={(v) => set({ travelersMax: v })} min={1} max={999} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151' }}>Pause Theme?</span>
          <Switch checked={ps.pauseTheme} onChange={(e) => set({ pauseTheme: e.target.checked })} />
        </div>
      </Block>

      {/* ── Publication Config ── */}
      <Block title="Publication Config">
        <div style={{ marginBottom: '0.75rem' }}>
          <TextField label="URL Slug" variant="outlined" size="sm" value={ps.urlSlug} onChange={(e) => set({ urlSlug: e.target.value })} helperText={`${ps.urlPrefix}${ps.urlSlug}`} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextField label="Publish Heading" variant="outlined" size="sm" value={ps.publishHeading} onChange={(e) => set({ publishHeading: e.target.value })} />
        </div>
        <div>
          <SelectField label="Content Language" variant="outlined" size="sm" value={ps.contentLanguage} onChange={(e) => set({ contentLanguage: e.target.value })}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </SelectField>
        </div>
      </Block>

      {/* ── Search Optimization ── */}
      <Block title="Search Optimization" extra={
        <button type="button" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #c7d2fe', background: '#eef2ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
          <Icon name="Sparkles" size={14} />
        </button>
      }>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <TextareaField label="From Search Keys" variant="outlined" size="sm" minRows={3} value={ps.fromSearchKeys} onChange={(e) => set({ fromSearchKeys: e.target.value })} />
          <TextareaField label="To Search Keys" variant="outlined" size="sm" minRows={3} value={ps.toSearchKeys} onChange={(e) => set({ toSearchKeys: e.target.value })} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextareaField label="General Search Keys" variant="outlined" size="sm" minRows={3} value={ps.generalSearchKeys} onChange={(e) => set({ generalSearchKeys: e.target.value })} />
        </div>
        <div>
          <TextareaField label="Offer Search Keys" variant="outlined" size="sm" minRows={2} value={ps.offerSearchKeys} onChange={(e) => set({ offerSearchKeys: e.target.value })} />
        </div>
      </Block>

      {/* ── Visibility & Options ── */}
      <Block title="Visibility & Options">
        <div style={{ marginBottom: '0.75rem' }}>
          <p style={{ margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>Visibility</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['public', 'private', 'agents_only'] as const).map((v) => (
              <span key={v} onClick={() => set({ visibility: v })} style={{
                padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem', cursor: 'pointer',
                background: ps.visibility === v ? '#4f46e5' : '#f3f4f6',
                color: ps.visibility === v ? '#fff' : '#374151',
                fontWeight: ps.visibility === v ? 700 : 400,
                border: `1px solid ${ps.visibility === v ? '#4f46e5' : '#e5e7eb'}`,
              }}>{v.replace('_', ' ')}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {([
            ['allowReviews',          'Allow Customer Reviews'],
            ['allowWishlist',         'Allow Add to Wishlist'],
            ['requireApproval',       'Require Booking Approval'],
            ['publishedInMarketplace','Published in Marketplace'],
          ] as const).map(([key, label]) => (
            <Checkbox key={key} label={label} checked={ps[key]} onChange={(e) => set({ [key]: e.target.checked } as Partial<PublishSettings>)} />
          ))}
        </div>
      </Block>

      {/* ── Internal Notes ── */}
      <Block title="Internal Notes">
        <TextareaField label="Notes (not shown to customers)" variant="outlined" size="sm" minRows={3}
          value={ps.notes} onChange={(e) => set({ notes: e.target.value })} />
      </Block>

    </div>
  );
}

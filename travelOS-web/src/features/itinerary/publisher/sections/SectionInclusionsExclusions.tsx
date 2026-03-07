'use client';
import React, { useState } from 'react';
import { Button, TextField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';

function ListEditor({
  title, items, icon, color, placeholder, onChange,
}: {
  title: string; items: string[]; icon: string; color: string;
  placeholder: string; onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState('');
  const add = () => { if (draft.trim()) { onChange([...items, draft.trim()]); setDraft(''); } };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const edit = (i: number, val: string) => onChange(items.map((x, j) => j === i ? val : x));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
        <span style={{ color, fontSize: '1rem' }}><Icon name={icon as 'Check'} size={16} /></span>
        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{title}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color)', marginLeft: 4 }}>({items.length})</span>
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
          <span style={{ color, flexShrink: 0 }}><Icon name={icon as 'Check'} size={13} /></span>
          <div style={{ flex: 1 }}>
            <TextField label={title} variant="outlined" size="sm" value={item} onChange={(e) => edit(i, e.target.value)} />
          </div>
          <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', flexShrink: 0 }}>
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <div style={{ flex: 1 }}>
          <TextField label={placeholder} variant="outlined" size="sm" value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          />
        </div>
        <Button size="sm" color="secondary" onClick={add} type="button">
          <Icon name="Plus" size={12} /> Add
        </Button>
      </div>
    </div>
  );
}

const INCLUSION_PRESETS  = ['Accommodation', 'Breakfast', 'All meals', 'Airport transfers', 'Sightseeing', 'Guide', 'Entry fees', 'Flights', 'Train tickets', 'Travel insurance'];
const EXCLUSION_PRESETS  = ['International flights', 'Visa fees', 'Personal expenses', 'Tips & gratuities', 'Travel insurance', 'Alcohol', 'Laundry', 'Camera fees'];

export function SectionInclusionsExclusions() {
  const ie     = usePublishStore((s) => s.data.inclusionsExclusions);
  const update = usePublishStore((s) => s.updateSection);

  const addPreset = (type: 'inclusions' | 'exclusions', val: string) => {
    if (!ie[type].includes(val))
      update('inclusionsExclusions', { ...ie, [type]: [...ie[type], val] });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Inclusions */}
      <div style={{ background: 'var(--cui-card-bg, #fff)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem' }}>
        <ListEditor
          title="Inclusions" items={ie.inclusions} icon="CircleCheck" color="#16a34a" placeholder="What's included…"
          onChange={(v) => update('inclusionsExclusions', { ...ie, inclusions: v })}
        />
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--cui-secondary-color)', marginBottom: 6 }}>Quick add:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {INCLUSION_PRESETS.map((p) => (
              <span key={p} onClick={() => addPreset('inclusions', p)} style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', cursor: 'pointer', background: ie.inclusions.includes(p) ? '#dcfce7' : 'var(--cui-light)', border: '1px solid #86efac', color: '#16a34a' }}>
                + {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Exclusions */}
      <div style={{ background: 'var(--cui-card-bg, #fff)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem' }}>
        <ListEditor
          title="Exclusions" items={ie.exclusions} icon="CircleX" color="#dc2626" placeholder="What's not included…"
          onChange={(v) => update('inclusionsExclusions', { ...ie, exclusions: v })}
        />
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--cui-secondary-color)', marginBottom: 6 }}>Quick add:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {EXCLUSION_PRESETS.map((p) => (
              <span key={p} onClick={() => addPreset('exclusions', p)} style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', cursor: 'pointer', background: ie.exclusions.includes(p) ? '#fee2e2' : 'var(--cui-light)', border: '1px solid #fca5a5', color: '#dc2626' }}>
                + {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div style={{ background: 'var(--cui-card-bg, #fff)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem' }}>
        <ListEditor
          title="Important Notes" items={ie.importantNotes} icon="Info" color="#d97706" placeholder="Important note…"
          onChange={(v) => update('inclusionsExclusions', { ...ie, importantNotes: v })}
        />
      </div>
    </div>
  );
}

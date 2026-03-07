'use client';
import React, { useState } from 'react';
import { Button, TextField, Checkbox } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { LocationPoint } from '../types/publish.types';

const card: React.CSSProperties = { background: 'var(--cui-card-bg, #fff)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' };

function LocationEditor({ title, loc, onChange }: { title: string; loc: LocationPoint; onChange: (l: LocationPoint) => void }) {
  return (
    <div style={card}>
      <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>{title}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextField label="City" variant="outlined" size="sm" startIcon="MapPin" value={loc.city} onChange={(e) => onChange({ ...loc, city: e.target.value })} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextField label="Country" variant="outlined" size="sm" startIcon="Globe" value={loc.country} onChange={(e) => onChange({ ...loc, country: e.target.value })} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextField label="Country ISO2" variant="outlined" size="sm" maxLength={2} value={loc.countryIso2} onChange={(e) => onChange({ ...loc, countryIso2: e.target.value.toUpperCase() })} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextField label="Latitude" variant="outlined" size="sm" type="number" value={loc.latitude || ''} onChange={(e) => onChange({ ...loc, latitude: +e.target.value })} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextField label="Longitude" variant="outlined" size="sm" type="number" value={loc.longitude || ''} onChange={(e) => onChange({ ...loc, longitude: +e.target.value })} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextField label="Timezone" variant="outlined" size="sm" value={loc.timezone} onChange={(e) => onChange({ ...loc, timezone: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

export function SectionSearchDetails() {
  const sd     = usePublishStore((s) => s.data.searchDetails);
  const update = usePublishStore((s) => s.updateSection);
  const [kwDraft, setKwDraft] = useState('');

  const addKeyword = () => {
    if (kwDraft.trim()) {
      update('searchDetails', { ...sd, searchKeywords: [...sd.searchKeywords, kwDraft.trim()] });
      setKwDraft('');
    }
  };

  return (
    <div>
      {/* Destination */}
      <div style={card}>
        <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Destination Info</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Destination Country" variant="outlined" size="sm" startIcon="Globe" value={sd.destinationCountry} onChange={(e) => update('searchDetails', { ...sd, destinationCountry: e.target.value })} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Destination City" variant="outlined" size="sm" startIcon="MapPin" value={sd.destinationCity} onChange={(e) => update('searchDetails', { ...sd, destinationCity: e.target.value })} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Country ISO2" variant="outlined" size="sm" maxLength={2} value={sd.destinationCountryIso2} onChange={(e) => update('searchDetails', { ...sd, destinationCountryIso2: e.target.value.toUpperCase() })} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Theme / Category" variant="outlined" size="sm" startIcon="Tag" value={sd.theme} onChange={(e) => update('searchDetails', { ...sd, theme: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', paddingBottom: 4 }}>
            <Checkbox label="Featured Package" checked={sd.isFeatured} onChange={(e) => update('searchDetails', { ...sd, isFeatured: e.target.checked })} />
            <Checkbox label="Instant Booking" checked={sd.isInstantBooking} onChange={(e) => update('searchDetails', { ...sd, isInstantBooking: e.target.checked })} />
          </div>
        </div>
      </div>

      {/* From / To Locations */}
      <LocationEditor title="Departure Location (From)" loc={sd.fromLocation} onChange={(l) => update('searchDetails', { ...sd, fromLocation: l })} />
      <LocationEditor title="Arrival Location (To)" loc={sd.toLocation} onChange={(l) => update('searchDetails', { ...sd, toLocation: l })} />

      {/* Keywords */}
      <div style={card}>
        <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Search Keywords</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {sd.searchKeywords.map((kw, i) => (
            <span key={i} style={{ background: 'var(--cui-light)', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', display: 'flex', gap: 4 }}>
              {kw}
              <span style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => update('searchDetails', { ...sd, searchKeywords: sd.searchKeywords.filter((_, j) => j !== i) })}>×</span>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1 }}>
            <TextField label="Add keyword" variant="outlined" size="sm" startIcon="Search" value={kwDraft}
              onChange={(e) => setKwDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }} />
          </div>
          <Button size="sm" color="secondary" onClick={addKeyword} type="button"><Icon name="Plus" size={12} /> Add</Button>
        </div>
      </div>
    </div>
  );
}

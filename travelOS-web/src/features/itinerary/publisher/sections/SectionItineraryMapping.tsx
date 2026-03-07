'use client';
import React from 'react';
import { Button, TextField, SelectField, Switch, Checkbox, FormRange } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { MapWaypoint, ItineraryMapping } from '../types/publish.types';

const MAP_STYLES: ItineraryMapping['mapStyle'][] = ['roadmap', 'satellite', 'terrain', 'hybrid'];

const newWaypoint = (order: number): MapWaypoint => ({
  label: `Stop ${order}`, day: 1, order, latitude: 0, longitude: 0,
});

export function SectionItineraryMapping() {
  const mapping = usePublishStore((s) => s.data.itineraryMapping);
  const update  = usePublishStore((s) => s.updateSection);
  const daily   = usePublishStore((s) => s.data.dailyItinerary);

  const set = (patch: Partial<ItineraryMapping>) => update('itineraryMapping', { ...mapping, ...patch });

  const addWaypoint = () => set({ waypoints: [...mapping.waypoints, newWaypoint(mapping.waypoints.length + 1)] });
  const updateWp = (i: number, wp: MapWaypoint) => set({ waypoints: mapping.waypoints.map((x, j) => j === i ? wp : x) });
  const removeWp = (i: number) => set({ waypoints: mapping.waypoints.filter((_, j) => j !== i).map((wp, j) => ({ ...wp, order: j + 1 })) });

  // Auto-populate from daily itinerary activities
  const autoPopulate = () => {
    const wps: MapWaypoint[] = [];
    daily.days.forEach((day) => {
      day.activities.forEach((act) => {
        if (act.latitude && act.longitude) {
          wps.push({ label: act.title || act.location, day: day.day, order: wps.length + 1, latitude: act.latitude, longitude: act.longitude });
        }
      });
    });
    if (wps.length) set({ waypoints: wps, enableMap: true });
  };

  return (
    <div>
      {/* Map toggle */}
      <div style={{ background: 'var(--cui-card-bg, #fff)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>Interactive Map</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color)', margin: '2px 0 0' }}>Show a route map on the package detail page</p>
          </div>
          <Switch label="Enable Map" checked={mapping.enableMap} onChange={(e) => set({ enableMap: e.target.checked })} />
        </div>

        {mapping.enableMap && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <SelectField label="Map Style" variant="outlined" size="sm" value={mapping.mapStyle} onChange={(e) => set({ mapStyle: e.target.value as ItineraryMapping['mapStyle'] })}>
                {MAP_STYLES.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
              </SelectField>
            </div>
            <div>
              <FormRange min={5} max={18} value={mapping.zoomLevel} onChange={(e) => set({ zoomLevel: +e.target.value })} style={{ marginTop: 8 }} />
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--cui-secondary-color)', margin: 0 }}>Level {mapping.zoomLevel}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
              <Checkbox label="Show Route Line" checked={mapping.showRoute} onChange={(e) => set({ showRoute: e.target.checked })} />
            </div>
          </div>
        )}
      </div>

      {/* Waypoints */}
      {mapping.enableMap && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Waypoints ({mapping.waypoints.length})</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {daily.days.length > 0 && (
                <Button size="sm" color="secondary" onClick={autoPopulate}>
                  <Icon name="Sparkles" size={12} /> Auto-populate from Itinerary
                </Button>
              )}
              <Button size="sm" color="primary" onClick={addWaypoint}><Icon name="Plus" size={12} /> Add Waypoint</Button>
            </div>
          </div>

          {mapping.waypoints.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--cui-secondary-color)', border: '2px dashed var(--cui-border-color)', borderRadius: 8, marginBottom: '1rem' }}>
              Add waypoints manually or click &quot;Auto-populate from Itinerary&quot; to pull coordinates from activities.
            </div>
          )}

          {mapping.waypoints.map((wp, i) => (
            <div key={i} style={{ border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.5rem', background: 'var(--cui-card-bg, #fff)', display: 'grid', gridTemplateColumns: 'auto 2fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'var(--cui-primary, #1B4F72)', color: '#fff', borderRadius: '50%', fontSize: '0.75rem', fontWeight: 700, marginBottom: 2 }}>{wp.order}</div>
              <div style={{ marginBottom: '0.75rem' }}>
                <TextField label="Label" variant="outlined" size="sm" startIcon="Tag" value={wp.label} onChange={(e) => updateWp(i, { ...wp, label: e.target.value })} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <SelectField label="Day" variant="outlined" size="sm" value={wp.day} onChange={(e) => updateWp(i, { ...wp, day: +e.target.value })}>
                  {daily.days.length > 0 ? daily.days.map((d) => <option key={d.day} value={d.day}>Day {d.day}</option>) : <option value={1}>Day 1</option>}
                </SelectField>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <TextField label="Latitude" variant="outlined" size="sm" type="number" step={0.000001} value={wp.latitude || ''} onChange={(e) => updateWp(i, { ...wp, latitude: +e.target.value })} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <TextField label="Longitude" variant="outlined" size="sm" type="number" step={0.000001} value={wp.longitude || ''} onChange={(e) => updateWp(i, { ...wp, longitude: +e.target.value })} />
              </div>
              <button type="button" onClick={() => removeWp(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, marginBottom: 2 }}><Icon name="Trash2" size={15} /></button>
            </div>
          ))}

          {/* Map placeholder */}
          {mapping.waypoints.length > 0 && (
            <div style={{ background: 'var(--cui-light)', border: '1px solid var(--cui-border-color)', borderRadius: 8, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', flexDirection: 'column', gap: 8 }}>
              <Icon name="Map" size={32} style={{ color: 'var(--cui-secondary-color)' }} />
              <p style={{ margin: 0, color: 'var(--cui-secondary-color)', fontSize: '0.875rem' }}>
                Map preview will render on the published package page ({mapping.waypoints.length} waypoints)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

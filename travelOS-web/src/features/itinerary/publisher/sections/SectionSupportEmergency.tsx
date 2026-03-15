'use client';
import React from 'react';
import { Button, TextField, TextareaField, Checkbox } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { Hospital, EmergencyContact } from '../types/publish.types';

const section: React.CSSProperties = { background: 'var(--cui-card-bg, #fff)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' };
const sectionTitle: React.CSSProperties = { fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--cui-body-color)' };

export function SectionSupportEmergency() {
  const se     = usePublishStore((s) => s.data.supportEmergency);
  const update = usePublishStore((s) => s.updateSection);

  const addHospital = () => update('supportEmergency', { ...se, hospitals: [...se.hospitals, { name: '', address: '', phone: '' }] });
  const updateHospital = (i: number, h: Hospital) => update('supportEmergency', { ...se, hospitals: se.hospitals.map((x, j) => j === i ? h : x) });
  const removeHospital = (i: number) => update('supportEmergency', { ...se, hospitals: se.hospitals.filter((_, j) => j !== i) });

  const addContact = () => update('supportEmergency', { ...se, emergencyContacts: [...se.emergencyContacts, { label: '', phone: '', available24h: false }] });
  const updateContact = (i: number, c: EmergencyContact) => update('supportEmergency', { ...se, emergencyContacts: se.emergencyContacts.map((x, j) => j === i ? c : x) });
  const removeContact = (i: number) => update('supportEmergency', { ...se, emergencyContacts: se.emergencyContacts.filter((_, j) => j !== i) });

  return (
    <div>
      {/* Emergency Numbers */}
      <div style={section}>
        <div style={sectionTitle}><Icon name="Phone" size={15} style={{ color: '#ef4444' }} /> Emergency Numbers</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="General Emergency" variant="outlined" size="xs" startIcon="Phone" value={se.emergencyNumber} onChange={(e) => update('supportEmergency', { ...se, emergencyNumber: e.target.value })} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Police" variant="outlined" size="xs" startIcon="Phone" value={se.policeNumber} onChange={(e) => update('supportEmergency', { ...se, policeNumber: e.target.value })} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Ambulance" variant="outlined" size="xs" startIcon="Phone" value={se.ambulanceNumber} onChange={(e) => update('supportEmergency', { ...se, ambulanceNumber: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Embassy */}
      <div style={section}>
        <div style={sectionTitle}><Icon name="Building2" size={15} style={{ color: '#1B4F72' }} /> Embassy Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Embassy Name" variant="outlined" size="xs" startIcon="Tag" value={se.embassyName} onChange={(e) => update('supportEmergency', { ...se, embassyName: e.target.value })} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Phone" variant="outlined" size="xs" startIcon="Phone" value={se.embassyPhone} onChange={(e) => update('supportEmergency', { ...se, embassyPhone: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1', marginBottom: '0.75rem' }}>
            <TextField label="Address" variant="outlined" size="xs" startIcon="MapPin" value={se.embassyAddress} onChange={(e) => update('supportEmergency', { ...se, embassyAddress: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Hospitals */}
      <div style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={sectionTitle}><Icon name="Hospital" size={15} style={{ color: '#dc2626' }} /> Hospitals ({se.hospitals.length})</div>
          <Button size="xs" color="secondary" onClick={addHospital}><Icon name="Plus" size={12} /> Add</Button>
        </div>
        {se.hospitals.map((h, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr auto', gap: 8, marginBottom: 6, alignItems: 'end' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <TextField label="Name" variant="outlined" size="xs" startIcon="Tag" value={h.name} onChange={(e) => updateHospital(i, { ...h, name: e.target.value })} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <TextField label="Address" variant="outlined" size="xs" startIcon="MapPin" value={h.address} onChange={(e) => updateHospital(i, { ...h, address: e.target.value })} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <TextField label="Phone" variant="outlined" size="xs" startIcon="Phone" value={h.phone} onChange={(e) => updateHospital(i, { ...h, phone: e.target.value })} />
            </div>
            <button type="button" onClick={() => removeHospital(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, marginBottom: 2 }}><Icon name="Trash2" size={15} /></button>
          </div>
        ))}
      </div>

      {/* Emergency Contacts */}
      <div style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={sectionTitle}><Icon name="Headset" size={15} style={{ color: '#7c3aed' }} /> Emergency Contacts ({se.emergencyContacts.length})</div>
          <Button size="xs" color="secondary" onClick={addContact}><Icon name="Plus" size={12} /> Add</Button>
        </div>
        {se.emergencyContacts.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
            <div style={{ flex: 2 }}>
              <TextField label="Label" variant="outlined" size="xs" startIcon="User" value={c.label} onChange={(e) => updateContact(i, { ...c, label: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <TextField label="Phone" variant="outlined" size="xs" startIcon="Phone" value={c.phone} onChange={(e) => updateContact(i, { ...c, phone: e.target.value })} />
            </div>
            <Checkbox label="24/7" checked={c.available24h} onChange={(e) => updateContact(i, { ...c, available24h: e.target.checked })} />
            <button type="button" onClick={() => removeContact(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Icon name="Trash2" size={15} /></button>
          </div>
        ))}
      </div>

      {/* Travel Insurance Tips */}
      <div style={section}>
        <div style={sectionTitle}><Icon name="Shield" size={15} style={{ color: '#059669' }} /> Travel Insurance Tips</div>
        <TextareaField label="Travel Insurance Tips" variant="outlined" size="sm" minRows={4} value={se.travelInsuranceTips}
          onChange={(e) => update('supportEmergency', { ...se, travelInsuranceTips: e.target.value })} />
      </div>

      {/* Notes */}
      <div style={section}>
        <TextareaField label="General Safety Notes" variant="outlined" size="sm" minRows={3} value={se.notes}
          onChange={(e) => update('supportEmergency', { ...se, notes: e.target.value })} />
      </div>
    </div>
  );
}

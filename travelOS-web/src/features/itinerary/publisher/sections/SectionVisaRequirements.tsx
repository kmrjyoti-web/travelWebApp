'use client';
import React, { useState } from 'react';
import { Button, TextField, TextareaField, SmartDialog } from '@/shared/components';
import { TagsInput } from '@/shared/components/forms';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { VisaApplicationStep, VisaOfficialSource } from '../types/publish.types';

const newStep = (): VisaApplicationStep => ({
  id: `step_${Date.now()}`, title: '', description: '', estimatedDuration: '', documents: [],
});

/* ── Step Modal ─────────────────────────────────────────────────── */
function StepModal({
  initial, onSave, onClose,
}: {
  initial: VisaApplicationStep;
  onSave: (s: VisaApplicationStep) => void;
  onClose: () => void;
}) {
  const [item, setItem] = useState<VisaApplicationStep>({ ...initial });
  const set = (p: Partial<VisaApplicationStep>) => setItem((i) => ({ ...i, ...p }));

  return (
    <SmartDialog
      isOpen
      onClose={onClose}
      title={initial.title ? 'Edit Step' : 'Add Step'}
      onConfirm={() => { onSave(item); onClose(); }}
      confirmText="Save"
      confirmIcon="Save"
      confirmDisabled={!item.title}
      cancelText="Cancel"
      size="lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <TextField label="Step Title" variant="outlined"
          value={item.title} onChange={(e) => set({ title: e.target.value })} />

        <TextareaField label="Description" variant="outlined" minRows={4}
          value={item.description} onChange={(e) => set({ description: e.target.value })} />

        <TextField label="Estimated Duration" variant="outlined" placeholder="e.g. 2-3 Weeks"
          value={item.estimatedDuration} onChange={(e) => set({ estimatedDuration: e.target.value })} />

        <TagsInput
          label="Required Documents"
          placeholder="Add document…"
          value={item.documents}
          onChange={(docs) => set({ documents: docs })}
        />
      </div>
    </SmartDialog>
  );
}

/* ── Step Display Card ──────────────────────────────────────────── */
function StepCard({ step, index, onEdit, onDelete }: {
  step: VisaApplicationStep; index: number; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', gap: 10, flex: 1 }}>
            <span style={{
              flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
              background: '#4f46e5', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, marginTop: 1,
            }}>{index + 1}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>
                {step.title || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Untitled step</span>}
              </p>
              {step.description && (
                <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
                  {step.description.length > 120 ? step.description.slice(0, 120) + '…' : step.description}
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
                {step.estimatedDuration && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#6b7280' }}>
                    <Icon name="Clock" size={11} style={{ color: '#4f46e5' }} />
                    {step.estimatedDuration}
                  </span>
                )}
                {step.documents.length > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#6b7280' }}>
                    <Icon name="FileText" size={11} style={{ color: '#4f46e5' }} />
                    {step.documents.length} document{step.documents.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <Button type="button" color="primary" variant="ghost" size="xs" onClick={onEdit}>
              <Icon name="Pencil" size={14} />
            </Button>
            <Button type="button" color="danger" variant="ghost" size="xs" onClick={onDelete}>
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ───────────────────────────────────────────────── */
export function SectionVisaRequirements() {
  const visa   = usePublishStore((s) => s.data.visaRequirements);
  const update = usePublishStore((s) => s.updateSection);
  const set    = (p: Partial<typeof visa>) => update('visaRequirements', { ...visa, ...p });

  const [stepModal, setStepModal] = useState<{ idx: number | null } | null>(null);

  /* ── Application steps helpers ── */
  const saveStep = (s: VisaApplicationStep) => {
    if (stepModal?.idx === null) {
      set({ applicationSteps: [...visa.applicationSteps, s] });
    } else if (stepModal?.idx !== undefined && stepModal.idx !== null) {
      set({ applicationSteps: visa.applicationSteps.map((x, j) => j === stepModal.idx ? s : x) });
    }
  };
  const removeStep = (i: number) => set({ applicationSteps: visa.applicationSteps.filter((_, j) => j !== i) });

  /* ── Official sources helpers ── */
  const addSource    = () => set({ officialSources: [...visa.officialSources, { name: '', url: '' }] });
  const updateSource = (i: number, p: Partial<VisaOfficialSource>) =>
    set({ officialSources: visa.officialSources.map((x, j) => j === i ? { ...x, ...p } : x) });
  const removeSource = (i: number) => set({ officialSources: visa.officialSources.filter((_, j) => j !== i) });

  /* ── Block style ── */
  const block: React.CSSProperties = {
    border: '1px solid #e5e7eb', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem', background: '#fff',
  };
  const sectionLabel = (text: string, sub?: string) => (
    <div style={{ marginBottom: '0.75rem' }}>
      <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{text}</p>
      {sub && <p style={{ margin: '1px 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>{sub}</p>}
    </div>
  );

  return (
    <div>

      {/* ── General Summary ── */}
      <div style={block}>
        {sectionLabel('General Summary', 'Visa Summary & Overview')}
        <TextareaField
          label=""
          variant="outlined"
          minRows={5}
          placeholder="Describe visa requirements, eligibility, and important notes…"
          value={visa.generalSummary}
          onChange={(e) => set({ generalSummary: e.target.value })}
        />
      </div>

      {/* ── Application Process ── */}
      <div style={block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {sectionLabel('Application Process')}
          <Button color="primary" variant="outline" size="xs" leftIcon="Plus"
            onClick={() => setStepModal({ idx: null })}
            style={{ marginBottom: '0.75rem' }}>
            Add Step
          </Button>
        </div>

        {visa.applicationSteps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.82rem', border: '2px dashed #e5e7eb', borderRadius: 8 }}>
            No process steps defined.
          </div>
        ) : (
          visa.applicationSteps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              onEdit={() => setStepModal({ idx: i })}
              onDelete={() => removeStep(i)}
            />
          ))
        )}
      </div>

      {/* ── Official Sources ── */}
      <div style={block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {sectionLabel('Official Sources')}
          <Button type="button" color="primary" variant="outline" size="xs" onClick={addSource}
            style={{ marginBottom: '0.75rem' }}>
            <Icon name="Plus" size={14} />
          </Button>
        </div>

        {visa.officialSources.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af', fontSize: '0.82rem', border: '2px dashed #e5e7eb', borderRadius: 8 }}>
            No sources added yet.
          </div>
        )}

        {visa.officialSources.map((src, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ flex: '0 0 200px' }}>
              <TextField label="" variant="outlined" size="xs" placeholder="Source name"
                value={src.name} onChange={(e) => updateSource(i, { name: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <TextField label="" variant="outlined" size="xs" placeholder="https://…"
                value={src.url} onChange={(e) => updateSource(i, { url: e.target.value })} />
            </div>
            <Button type="button" color="danger" variant="outline" size="xs" onClick={() => removeSource(i)}>
              <Icon name="Trash2" size={13} />
            </Button>
          </div>
        ))}
      </div>

      {/* ── Step Modal ── */}
      {stepModal !== null && (
        <StepModal
          initial={stepModal.idx === null ? newStep() : visa.applicationSteps[stepModal.idx]}
          onSave={saveStep}
          onClose={() => setStepModal(null)}
        />
      )}
    </div>
  );
}

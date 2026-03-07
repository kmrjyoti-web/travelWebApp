'use client';
/**
 * RegistrationFormParts — shared sub-components for RegistrationForm.tsx.
 * Extracted to keep RegistrationForm under 300 lines.
 */
import React from 'react';
import { Icon } from '@/shared/components/Icon';
import { TextField, SelectField, Checkbox } from '@/shared/components';
import type { UserTypeDropdownItem, UserTypeFieldSchema, FieldType } from '../types/user-type.types';

// ── Loading indicator ─────────────────────────────────────────────────────────
export function LoadingBarsInline() {
  return (
    <span className="tos-loading-bars">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="tos-loading-bar" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </span>
  );
}

// ── Step dots indicator ───────────────────────────────────────────────────────
export function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i + 1 === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i + 1 <= step ? 'var(--tos-primary)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s',
          }}
        />
      ))}
    </div>
  );
}

// ── User type card ────────────────────────────────────────────────────────────
export function TypeCardRF({
  item, selected, onSelect,
}: { item: UserTypeDropdownItem; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '12px 14px', marginBottom: 10,
        background: selected ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.06)',
        border: `1.5px solid ${selected ? item.colorHex || 'var(--tos-primary)' : 'rgba(255,255,255,0.12)'}`,
        borderLeft: `4px solid ${item.colorHex || 'var(--tos-primary)'}`,
        borderRadius: 'var(--tos-border-radius)',
        color: 'rgba(255,255,255,0.9)', cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: selected ? item.colorHex || 'var(--tos-primary)' : 'rgba(255,255,255,0.1)',
      }}>
        <Icon name={item.iconName as Parameters<typeof Icon>[0]['name']} size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.displayName}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
          {item.description}
        </div>
        {item.requiresApproval && (
          <div style={{ fontSize: 11, marginTop: 4, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="Clock" size={11} /> Requires approval
          </div>
        )}
      </div>
      {selected && (
        <div style={{ marginLeft: 'auto' }}>
          <Icon name="CircleCheck" size={18} style={{ color: item.colorHex || 'var(--tos-primary)' }} />
        </div>
      )}
    </button>
  );
}

// ── Dynamic field value type ──────────────────────────────────────────────────
export type FieldValue = string | number | boolean | string[];

// ── Dynamic field renderer ────────────────────────────────────────────────────
export function DynamicFieldRF({
  field, value, error, onChange,
}: {
  field: UserTypeFieldSchema;
  value: FieldValue;
  error: string | undefined;
  onChange: (val: FieldValue) => void;
}) {
  const TEXT_TYPES: FieldType[] = ['text', 'email', 'url', 'phone'];

  if (TEXT_TYPES.includes(field.fieldType)) {
    return (
      <TextField
        id={`rf-${field.fieldKey}`}
        label={field.label}
        type={field.fieldType === 'phone' ? 'text' : field.fieldType}
        inputMode={field.fieldType === 'phone' ? 'numeric' : undefined}
        placeholder={field.placeholder ?? ''}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        size="sm"
        error={!!error}
        helperText={error}
        aria-invalid={!!error}
      />
    );
  }
  if (field.fieldType === 'number') {
    return (
      <TextField
        id={`rf-${field.fieldKey}`}
        label={field.label}
        type="number"
        placeholder={field.placeholder ?? ''}
        value={typeof value === 'number' ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        variant="outlined"
        size="sm"
        error={!!error}
        helperText={error}
        aria-invalid={!!error}
      />
    );
  }
  if (field.fieldType === 'select') {
    return (
      <SelectField
        id={`rf-${field.fieldKey}`}
        label={field.label}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        size="sm"
        error={!!error}
        helperText={error}
        aria-invalid={!!error}
      >
        <option value="">— Select —</option>
        {(field.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </SelectField>
    );
  }
  if (field.fieldType === 'multi_select') {
    const sel = Array.isArray(value) ? value : [];
    return (
      <div role="group" aria-label={field.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(field.options ?? []).map((o) => {
          const checked = sel.includes(o.value);
          return (
            <Checkbox
              key={o.value}
              label={o.label}
              checked={checked}
              onChange={() => onChange(checked ? sel.filter((v) => v !== o.value) : [...sel, o.value])}
            />
          );
        })}
      </div>
    );
  }
  if (field.fieldType === 'file_upload') {
    return (
      <input id={`rf-${field.fieldKey}`} type="file"
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? '')}
        style={{ width: '100%', padding: '8px', cursor: 'pointer' }} aria-invalid={!!error}
      />
    );
  }
  if (field.fieldType === 'date') {
    return (
      <TextField
        id={`rf-${field.fieldKey}`}
        label={field.label}
        type="date"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        size="sm"
        error={!!error}
        helperText={error}
        aria-invalid={!!error}
      />
    );
  }
  if (field.fieldType === 'boolean') {
    return (
      <Checkbox
        id={`rf-${field.fieldKey}`}
        label={field.label}
        checked={value === true}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }
  return null;
}

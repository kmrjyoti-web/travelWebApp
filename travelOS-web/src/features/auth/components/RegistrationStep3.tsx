'use client';
/**
 * RegistrationStep3 — Dynamic profile field form.
 * Renders fields from UserTypeFieldSchema[] fetched in Step 2.
 * Validates required fields + optional regex, then stores profileData.
 */
import React, { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
import { TextField, SelectField, Checkbox } from '@/shared/components';
import type { UserTypeFieldSchema, FieldType } from '../types/user-type.types';
import { useRegistrationStore } from '../stores/registration.store';
import { StepProgress, LoadingBars } from './RegistrationStep1';

// ── Props ─────────────────────────────────────────────────────────────────────
interface RegistrationStep3Props {
  fields: UserTypeFieldSchema[];
  /** Called after profileData saved — parent triggers final API submit */
  onSubmit: () => void;
  onBack: () => void;
  /** Optional extra fields rendered before the submit button (e.g. tax ID). */
  extraFields?: React.ReactNode;
}

// ── Field value union ─────────────────────────────────────────────────────────
type FieldValue = string | number | boolean | string[];

// ── Single field renderer ─────────────────────────────────────────────────────
interface FieldRendererProps {
  field: UserTypeFieldSchema;
  value: FieldValue;
  error: string | undefined;
  onChange: (val: FieldValue) => void;
}

function FieldRenderer({ field, value, error, onChange }: FieldRendererProps) {
  const textTypes: FieldType[] = ['text', 'email', 'url', 'phone'];

  // Text / email / url / phone
  if (textTypes.includes(field.fieldType)) {
    return (
      <TextField
        id={`s3-${field.fieldKey}`}
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
        aria-describedby={field.helpText ? `${field.fieldKey}-help` : undefined}
        aria-invalid={!!error}
      />
    );
  }

  // Number
  if (field.fieldType === 'number') {
    return (
      <TextField
        id={`s3-${field.fieldKey}`}
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

  // Select
  if (field.fieldType === 'select') {
    return (
      <SelectField
        id={`s3-${field.fieldKey}`}
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
        {(field.options ?? []).map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </SelectField>
    );
  }

  // Multi-select (checkboxes)
  if (field.fieldType === 'multi_select') {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div
        role="group"
        aria-label={field.label}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {(field.options ?? []).map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={checked}
              onChange={() => {
                const next = checked
                  ? selected.filter((v) => v !== opt.value)
                  : [...selected, opt.value];
                onChange(next);
              }}
            />
          );
        })}
      </div>
    );
  }

  // File upload (capture name only) — kept as raw input per golden rule exception
  if (field.fieldType === 'file_upload') {
    return (
      <input
        id={`s3-${field.fieldKey}`}
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          onChange(file ? file.name : '');
        }}
        style={{ width: '100%', padding: '8px', cursor: 'pointer' }}
        aria-invalid={!!error}
      />
    );
  }

  // Date
  if (field.fieldType === 'date') {
    return (
      <TextField
        id={`s3-${field.fieldKey}`}
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

  // Boolean (single checkbox)
  if (field.fieldType === 'boolean') {
    return (
      <Checkbox
        id={`s3-${field.fieldKey}`}
        label={field.label}
        checked={value === true}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
export function RegistrationStep3({ fields, onSubmit, onBack, extraFields }: RegistrationStep3Props) {
  const { userTypeDisplayName, setProfileData } = useRegistrationStore();

  // Local form state: fieldKey → value
  const [values, setValues] = useState<Record<string, FieldValue>>(() => {
    const init: Record<string, FieldValue> = {};
    for (const f of fields) {
      if (f.fieldType === 'boolean') init[f.fieldKey] = false;
      else if (f.fieldType === 'multi_select') init[f.fieldKey] = [];
      else if (f.fieldType === 'number') init[f.fieldKey] = '';
      else init[f.fieldKey] = '';
    }
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedFields = [...fields].sort((a, b) => a.sortOrder - b.sortOrder);

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of sortedFields) {
      const val = values[field.fieldKey];

      // Required check
      if (field.isRequired) {
        if (field.fieldType === 'multi_select') {
          if (!Array.isArray(val) || val.length === 0) {
            newErrors[field.fieldKey] = `${field.label} is required`;
          }
        } else if (field.fieldType === 'boolean') {
          // booleans are optional by nature even if "required"
        } else if (val === '' || val === null || val === undefined) {
          newErrors[field.fieldKey] = `${field.label} is required`;
        }
      }

      // Regex check
      if (
        field.validationRegex &&
        typeof val === 'string' &&
        val.length > 0 &&
        !new RegExp(field.validationRegex).test(val)
      ) {
        newErrors[field.fieldKey] = field.helpText
          ? `Invalid format: ${field.helpText}`
          : `Invalid format for ${field.label}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Build profileData — exclude empty optional fields
    const profileData: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(values)) {
      if (val !== '' && val !== null && val !== undefined) {
        profileData[key] = val;
      }
    }
    setProfileData(profileData);
    onSubmit();
    // isSubmitting stays true — parent will navigate away
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Step 3: Profile details">
      {/* Header */}
      <div className="tos-login-card__logo">
        <Icon name="Plane" size={28} aria-hidden="true" />
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>TravelOS</span>
      </div>
      <h2 className="tos-login-card__title">Create Account</h2>
      <p className="tos-login-card__subtitle" style={{ marginBottom: 16 }}>
        Set up your {userTypeDisplayName || 'profile'}
      </p>

      <StepProgress step={3} total={3} />

      {/* Dynamic fields */}
      {sortedFields.map((field) => {
        if (field.fieldType === 'boolean') {
          // Boolean renders its own label inside FieldRenderer
          return (
            <div
              key={field.fieldKey}
              className="tos-login-field"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <FieldRenderer
                field={field}
                value={values[field.fieldKey] ?? false}
                error={errors[field.fieldKey]}
                onChange={(val) =>
                  setValues((prev) => ({ ...prev, [field.fieldKey]: val }))
                }
              />
              {errors[field.fieldKey] && (
                <div className="tos-login-field__error" role="alert">
                  {errors[field.fieldKey]}
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={field.fieldKey} className="tos-login-field">
            <label htmlFor={`s3-${field.fieldKey}`}>
              {field.label}
              {field.isRequired && (
                <span aria-hidden="true" style={{ color: '#fca5a5', marginLeft: 2 }}>*</span>
              )}
            </label>

            <FieldRenderer
              field={field}
              value={values[field.fieldKey] ?? ''}
              error={errors[field.fieldKey]}
              onChange={(val) =>
                setValues((prev) => ({ ...prev, [field.fieldKey]: val }))
              }
            />

            {field.helpText && !errors[field.fieldKey] && (
              <div
                id={`${field.fieldKey}-help`}
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}
              >
                {field.helpText}
              </div>
            )}
            {errors[field.fieldKey] && (
              <div className="tos-login-field__error" role="alert">
                {errors[field.fieldKey]}
              </div>
            )}
          </div>
        );
      })}

      {/* Extra fields (e.g. country-specific tax ID injected by parent) */}
      {extraFields}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            flex: 1, padding: '10px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--tos-border-radius)',
            color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontWeight: 500,
          }}
        >
          Back
        </button>
        <button
          type="submit"
          className="tos-login-btn"
          disabled={isSubmitting}
          style={{ flex: 2, marginTop: 0 }}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <><LoadingBars /> Creating Account…</>
          ) : (
            <><Icon name="UserPlus" size={16} aria-hidden="true" /> Create Account</>
          )}
        </button>
      </div>
    </form>
  );
}

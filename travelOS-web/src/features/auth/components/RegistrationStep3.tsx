'use client';
/**
 * RegistrationStep3 — Dynamic profile field form.
 * Renders fields from UserTypeFieldSchema[] fetched in Step 2.
 * Validates required fields + optional regex, then stores profileData.
 */
import React, { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
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
  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '10px var(--tos-spacing-md)',
    background: 'rgba(255,255,255,0.1)',
    border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
    borderRadius: 'var(--tos-border-radius)',
    color: '#ffffff',
    fontSize: 14,
    outline: 'none',
  };

  const textTypes: FieldType[] = ['text', 'email', 'url', 'phone'];

  // Text / email / url / phone
  if (textTypes.includes(field.fieldType)) {
    return (
      <input
        id={`s3-${field.fieldKey}`}
        type={field.fieldType === 'phone' ? 'text' : field.fieldType}
        inputMode={field.fieldType === 'phone' ? 'numeric' : undefined}
        placeholder={field.placeholder ?? ''}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        style={inputBase}
        aria-describedby={field.helpText ? `${field.fieldKey}-help` : undefined}
        aria-invalid={!!error}
      />
    );
  }

  // Number
  if (field.fieldType === 'number') {
    return (
      <input
        id={`s3-${field.fieldKey}`}
        type="number"
        placeholder={field.placeholder ?? ''}
        value={typeof value === 'number' ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        style={inputBase}
        aria-invalid={!!error}
      />
    );
  }

  // Select
  if (field.fieldType === 'select') {
    return (
      <select
        id={`s3-${field.fieldKey}`}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputBase }}
        aria-invalid={!!error}
      >
        <option value="" style={{ background: '#1a2a3a', color: '#ffffff' }}>
          — Select —
        </option>
        {(field.options ?? []).map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ background: '#1a2a3a', color: '#ffffff' }}
          >
            {opt.label}
          </option>
        ))}
      </select>
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
            <label
              key={opt.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.85)',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const next = checked
                    ? selected.filter((v) => v !== opt.value)
                    : [...selected, opt.value];
                  onChange(next);
                }}
                style={{ width: 16, height: 16 }}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    );
  }

  // File upload (capture name only)
  if (field.fieldType === 'file_upload') {
    return (
      <input
        id={`s3-${field.fieldKey}`}
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          onChange(file ? file.name : '');
        }}
        style={{
          ...inputBase,
          padding: '8px',
          cursor: 'pointer',
        }}
        aria-invalid={!!error}
      />
    );
  }

  // Date
  if (field.fieldType === 'date') {
    return (
      <input
        id={`s3-${field.fieldKey}`}
        type="date"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        style={inputBase}
        aria-invalid={!!error}
      />
    );
  }

  // Boolean (single checkbox)
  if (field.fieldType === 'boolean') {
    return (
      <label
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.85)',
        }}
      >
        <input
          id={`s3-${field.fieldKey}`}
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: 16, height: 16 }}
        />
        {field.label}
      </label>
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

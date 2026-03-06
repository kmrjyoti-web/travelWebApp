'use client';
/**
 * RegistrationStep2 — Dynamic user-type selection cards.
 * Fetches types from GET /api/v1/user-types/dropdown?selfOnly=true
 * On Next: fetches field schemas; if 0 fields → skip step 3 (signals via onNext(false)).
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@/shared/components/Icon';
import { api } from '@/shared/services/api';
import type { UserTypeDropdownItem, UserTypeFieldSchema } from '../types/user-type.types';
import { useRegistrationStore } from '../stores/registration.store';
import { StepProgress, LoadingBars } from './RegistrationStep1';

// ── Props ─────────────────────────────────────────────────────────────────────
interface RegistrationStep2Props {
  /**
   * Called after Next succeeds.
   * @param fields - field schemas from API; empty array means skip step 3
   */
  onNext: (fields: UserTypeFieldSchema[]) => void;
  onBack: () => void;
}

// ── Type card ─────────────────────────────────────────────────────────────────
interface TypeCardProps {
  item: UserTypeDropdownItem;
  selected: boolean;
  onSelect: () => void;
}

function TypeCard({ item, selected, onSelect }: TypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={item.displayName}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 14px',
        marginBottom: 10,
        background: selected ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.06)',
        border: `1.5px solid ${selected ? item.colorHex || 'var(--tos-primary)' : 'rgba(255,255,255,0.12)'}`,
        borderLeft: `4px solid ${item.colorHex || 'var(--tos-primary)'}`,
        borderRadius: 'var(--tos-border-radius)',
        color: 'rgba(255,255,255,0.9)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: selected ? item.colorHex || 'var(--tos-primary)' : 'rgba(255,255,255,0.1)',
        }}
      >
        <Icon
          name={item.iconName as Parameters<typeof Icon>[0]['name']}
          size={18}
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.displayName}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
          {item.description}
        </div>
        {item.requiresApproval && (
          <div
            style={{
              fontSize: 11, marginTop: 4, color: '#fbbf24',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Icon name="Clock" size={11} aria-hidden="true" /> Requires approval
          </div>
        )}
      </div>

      {/* Checkmark */}
      {selected && (
        <div style={{ marginLeft: 'auto' }}>
          <Icon name="CircleCheck" size={18} style={{ color: item.colorHex || 'var(--tos-primary)' }} />
        </div>
      )}
    </button>
  );
}

// ── Group heading ─────────────────────────────────────────────────────────────
function GroupHeading({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: 8,
        marginTop: 14,
      }}
    >
      {label}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function RegistrationStep2({ onNext, onBack }: RegistrationStep2Props) {
  const [types, setTypes] = useState<UserTypeDropdownItem[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [nextError, setNextError] = useState<string | null>(null);

  const { userTypeCode, setUserTypeCode } = useRegistrationStore();

  // ── Fetch type list on mount ──────────────────────────────────────────────
  const loadTypes = useCallback(async () => {
    setIsLoadingTypes(true);
    setFetchError(null);
    try {
      const res = (await api.get<unknown, { data: UserTypeDropdownItem[] }>(
        '/user-types/dropdown',
        { params: { selfOnly: true } }
      )) as { data: UserTypeDropdownItem[] };
      setTypes(res.data ?? []);
    } catch {
      // Fallback mock for UI development when backend is unavailable
      if (process.env.NODE_ENV === 'development') {
        setTypes([
          {
            code: 'TRAVELER', displayName: 'Traveler', description: 'Plan & book travel for yourself',
            iconName: 'User', colorHex: '#3b82f6', group: 'Individual', selfRegistrationAllowed: true, requiresApproval: false,
          },
          {
            code: 'INFLUENCER', displayName: 'Influencer', description: 'Share travel content & earn commissions',
            iconName: 'Star', colorHex: '#a78bfa', group: 'Individual', selfRegistrationAllowed: true, requiresApproval: false,
          },
          {
            code: 'TRAVEL_AGENT', displayName: 'Travel Agent', description: 'Manage bookings for clients',
            iconName: 'Briefcase', colorHex: '#34d399', group: 'Business', selfRegistrationAllowed: true, requiresApproval: true,
          },
          {
            code: 'DMC_PROVIDER', displayName: 'DMC Provider', description: 'Destination management company',
            iconName: 'Building2', colorHex: '#f59e0b', group: 'Business', selfRegistrationAllowed: true, requiresApproval: true,
          },
        ]);
      } else {
        setFetchError('Failed to load account types. Please try again.');
      }
    } finally {
      setIsLoadingTypes(false);
    }
  }, []);

  useEffect(() => {
    void loadTypes();
  }, [loadTypes]);

  // ── Handle Next ───────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (!userTypeCode) {
      setNextError('Please select an account type to continue.');
      return;
    }
    setNextError(null);
    setIsLoadingFields(true);
    try {
      const res = (await api.get<unknown, { data: UserTypeFieldSchema[] }>(
        `/user-types/${userTypeCode}/fields`
      )) as { data: UserTypeFieldSchema[] };
      const fields = res.data ?? [];
      onNext(fields);
    } catch {
      // In dev mode, provide mock fields for business types
      if (process.env.NODE_ENV === 'development') {
        const businessTypes = ['TRAVEL_AGENT', 'DMC_PROVIDER'];
        if (businessTypes.includes(userTypeCode)) {
          onNext([
            {
              fieldKey: 'businessName', label: 'Business Name', fieldType: 'text',
              isRequired: true, placeholder: 'e.g. Axis Travels Pvt Ltd', sortOrder: 1,
            },
            {
              fieldKey: 'gstNumber', label: 'GST Number', fieldType: 'text',
              isRequired: false, placeholder: 'e.g. 22AAAAA0000A1Z5',
              validationRegex: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$',
              helpText: '15-digit GST registration number', sortOrder: 2,
            },
            {
              fieldKey: 'yearsInBusiness', label: 'Years in Business', fieldType: 'number',
              isRequired: false, placeholder: '5', sortOrder: 3,
            },
          ]);
        } else {
          onNext([]);
        }
      } else {
        setNextError('Failed to load profile fields. Please try again.');
      }
    } finally {
      setIsLoadingFields(false);
    }
  };

  // ── Group types ───────────────────────────────────────────────────────────
  const grouped = types.reduce<Record<string, UserTypeDropdownItem[]>>((acc, t) => {
    const g = t.group || 'Other';
    if (!acc[g]) acc[g] = [];
    acc[g]!.push(t);
    return acc;
  }, {});

  const selectedItem = types.find((t) => t.code === userTypeCode);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div role="region" aria-label="Step 2: Account type">
      {/* Header */}
      <div className="tos-login-card__logo">
        <Icon name="Plane" size={28} aria-hidden="true" />
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>TravelOS</span>
      </div>
      <h2 className="tos-login-card__title">Create Account</h2>
      <p className="tos-login-card__subtitle" style={{ marginBottom: 16 }}>
        What best describes you?
      </p>

      <StepProgress step={2} total={3} />

      {/* Loading skeleton */}
      {isLoadingTypes && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.5)' }}>
          <LoadingBars />
          <div style={{ marginTop: 8, fontSize: 13 }}>Loading account types…</div>
        </div>
      )}

      {/* Fetch error */}
      {!isLoadingTypes && fetchError && (
        <div
          style={{
            padding: '10px 14px', background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--tos-border-radius)',
            color: '#fca5a5', fontSize: 13, marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}
          role="alert"
        >
          <Icon name="CircleAlert" size={14} />
          {fetchError}
          <button
            type="button"
            onClick={() => void loadTypes()}
            style={{
              marginLeft: 'auto', background: 'transparent', border: 'none',
              color: '#93c5fd', cursor: 'pointer', fontSize: 12, textDecoration: 'underline',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Grouped type cards */}
      {!isLoadingTypes && !fetchError && (
        <div>
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              {Object.keys(grouped).length > 1 && <GroupHeading label={group} />}
              {items.map((item) => (
                <TypeCard
                  key={item.code}
                  item={item}
                  selected={userTypeCode === item.code}
                  onSelect={() => {
                    setUserTypeCode(item.code, item.displayName, false);
                    setNextError(null);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Next error */}
      {nextError && (
        <div
          className="tos-login-field__error"
          role="alert"
          style={{ marginBottom: 8 }}
        >
          {nextError}
        </div>
      )}

      {/* Selected summary */}
      {selectedItem && (
        <div
          style={{
            padding: '8px 12px', background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 'var(--tos-border-radius)',
            fontSize: 12, color: '#93c5fd', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Icon name="CircleCheck" size={13} aria-hidden="true" />
          Selected: <strong>{selectedItem.displayName}</strong>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
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
          type="button"
          className="tos-login-btn"
          onClick={() => void handleNext()}
          disabled={!userTypeCode || isLoadingFields}
          style={{ flex: 2, marginTop: 0 }}
          aria-busy={isLoadingFields}
        >
          {isLoadingFields ? (
            <><LoadingBars /> Loading…</>
          ) : (
            <><Icon name="ArrowRight" size={16} aria-hidden="true" /> Next</>
          )}
        </button>
      </div>
    </div>
  );
}

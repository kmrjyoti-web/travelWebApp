'use client';
/**
 * GeoTargetingTab — Tab 4 of GeoSettingsDrawer.
 * Manages regional targeting: countries, languages, region boost, currency display, and timezone.
 */
import React from 'react';
import { SelectField, Switch, TagsInput } from '@/shared/components';
import type { GeoSettings, RegionBoost } from './types';

const REGION_BOOST_OPTIONS: Array<{ value: RegionBoost; label: string }> = [
  { value: null, label: 'No Boost (Global Default)' },
  { value: 'south_asia', label: 'South Asia' },
  { value: 'middle_east', label: 'Middle East' },
  { value: 'europe', label: 'Europe' },
  { value: 'global', label: 'Global (Priority)' },
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Pacific/Honolulu',
];

interface GeoTargetingTabProps {
  values: GeoSettings;
  onChange: (patch: Partial<GeoSettings>) => void;
}

export function GeoTargetingTab({ values, onChange }: GeoTargetingTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Target Countries */}
      <TagsInput
        label="Target Countries (ISO codes)"
        value={values.targetCountries}
        onChange={(tags) => onChange({ targetCountries: tags })}
        placeholder="e.g. US, GB, IN"
        helperText="2-letter ISO 3166-1 country codes — controls regional search visibility"
      />

      {/* Target Languages */}
      <TagsInput
        label="Target Languages"
        value={values.targetLanguages}
        onChange={(tags) => onChange({ targetLanguages: tags })}
        placeholder="e.g. en, fr, ar"
        helperText="BCP-47 language codes — used in hreflang signals"
      />

      {/* Region Boost */}
      <SelectField
        label="Region Boost"
        value={values.regionBoost ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          onChange({ regionBoost: (v === '' ? null : v) as RegionBoost });
        }}
        helperText="Prioritise this itinerary for AI recommendations in a specific region"
      >
        {REGION_BOOST_OPTIONS.map(({ value, label }) => (
          <option key={value ?? '__none__'} value={value ?? ''}>{label}</option>
        ))}
      </SelectField>

      {/* Timezone */}
      <SelectField
        label="Timezone"
        value={values.timezone}
        onChange={(e) => onChange({ timezone: e.target.value })}
        helperText="Itinerary's primary timezone — affects date/time structured data"
      >
        {TIMEZONES.map((tz) => (
          <option key={tz} value={tz}>{tz}</option>
        ))}
      </SelectField>

      {/* Local Currency Display */}
      <div
        style={{
          padding: 12,
          border: '1px solid var(--cui-border-color)',
          borderRadius: 8,
        }}
      >
        <Switch
          checked={values.localCurrencyDisplay}
          onChange={(e) => onChange({ localCurrencyDisplay: e.target.checked })}
          label="Show Local Currency"
          description="Automatically display pricing in the visitor's local currency using geo-IP"
          aria-label="Toggle local currency display"
        />
      </div>

    </div>
  );
}

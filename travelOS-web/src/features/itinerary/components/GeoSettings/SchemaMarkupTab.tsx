'use client';
/**
 * SchemaMarkupTab — Tab 1 of GeoSettingsDrawer.
 * Handles structured data markup fields: schema type, destination coordinates,
 * pricing, currency, duration, availability, and provider info.
 */
import React from 'react';
import { TextField, SelectField } from '@/shared/components';
import type { GeoSettings, SchemaType, Availability } from './types';

interface SchemaMarkupTabProps {
  values: GeoSettings;
  onChange: (patch: Partial<GeoSettings>) => void;
}

const SCHEMA_TYPES: SchemaType[] = [
  'TouristTrip',
  'TravelAction',
  'TouristAttraction',
  'Event',
];

const AVAILABILITY_OPTIONS: Availability[] = [
  'InStock',
  'SoldOut',
  'PreOrder',
  'LimitedAvailability',
];

const AVAILABILITY_LABELS: Record<Availability, string> = {
  InStock: 'In Stock',
  SoldOut: 'Sold Out',
  PreOrder: 'Pre-Order',
  LimitedAvailability: 'Limited Availability',
};

export function SchemaMarkupTab({ values, onChange }: SchemaMarkupTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <SelectField
        label="Schema Type"
        value={values.schemaType}
        onChange={(e) => onChange({ schemaType: e.target.value as SchemaType })}
        helperText="Schema.org type used for structured data markup"
      >
        {SCHEMA_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </SelectField>

      <TextField
        label="Destination Name"
        value={values.destinationName}
        onChange={(e) => onChange({ destinationName: e.target.value })}
        placeholder="e.g. Paris, France"
        helperText="Primary destination shown in schema markup"
        aria-label="Destination name"
      />

      {/* Lat / Lng in a two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <TextField
          label="Latitude"
          type="number"
          value={values.destinationLat ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ destinationLat: v === '' ? null : Number(v) });
          }}
          placeholder="-90 to 90"
          helperText="Decimal degrees (e.g. 48.8566)"
          aria-label="Destination latitude"
        />
        <TextField
          label="Longitude"
          type="number"
          value={values.destinationLng ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ destinationLng: v === '' ? null : Number(v) });
          }}
          placeholder="-180 to 180"
          helperText="Decimal degrees (e.g. 2.3522)"
          aria-label="Destination longitude"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <TextField
          label="Price Range"
          value={values.priceRange}
          onChange={(e) => onChange({ priceRange: e.target.value })}
          placeholder="e.g. $500 - $1200"
          helperText="Displayed price range for schema markup"
          aria-label="Price range"
        />
        <TextField
          label="Currency (ISO)"
          value={values.currency}
          onChange={(e) => onChange({ currency: e.target.value.toUpperCase().slice(0, 3) })}
          placeholder="USD"
          maxLength={3}
          helperText="3-letter code"
          aria-label="Currency ISO code"
        />
      </div>

      <TextField
        label="Duration (ISO 8601)"
        value={values.durationIso}
        onChange={(e) => onChange({ durationIso: e.target.value })}
        placeholder="e.g. P7D"
        helperText="Duration in ISO 8601 format: P7D = 7 days, P14D = 14 days"
        aria-label="Trip duration in ISO 8601 format"
      />

      <SelectField
        label="Availability"
        value={values.availability}
        onChange={(e) => onChange({ availability: e.target.value as Availability })}
        helperText="Current booking availability status"
      >
        {AVAILABILITY_OPTIONS.map((a) => (
          <option key={a} value={a}>{AVAILABILITY_LABELS[a]}</option>
        ))}
      </SelectField>

      <TextField
        label="Provider Name"
        value={values.providerName}
        onChange={(e) => onChange({ providerName: e.target.value })}
        placeholder="e.g. TravelOS DMC"
        helperText="Tour operator or service provider name"
        aria-label="Provider name"
      />

      <TextField
        label="Provider URL"
        type="url"
        value={values.providerUrl}
        onChange={(e) => onChange({ providerUrl: e.target.value })}
        placeholder="https://example.com"
        helperText="Official website of the provider"
        aria-label="Provider URL"
      />

    </div>
  );
}

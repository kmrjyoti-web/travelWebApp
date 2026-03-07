'use client';
/**
 * SeoControlsTab — Tab 3 of GeoSettingsDrawer.
 * Manages SEO meta tags, OpenGraph, Twitter card, robots, canonical URL, and slug.
 */
import React from 'react';
import { TextField, TextareaField, SelectField, Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { GeoSettings, TwitterCard } from './types';

const SEO_TITLE_MAX = 70;
const SEO_TITLE_WARN = 60;
const META_DESC_MAX = 200;
const META_DESC_WARN = 160;

const ROBOTS_OPTIONS = [
  'index,follow',
  'noindex,nofollow',
  'index,nofollow',
  'noindex,follow',
];

const TWITTER_CARD_OPTIONS: TwitterCard[] = ['summary', 'summary_large_image'];

interface SeoControlsTabProps {
  values: GeoSettings;
  onChange: (patch: Partial<GeoSettings>) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function SeoControlsTab({ values, onChange }: SeoControlsTabProps) {
  const titleLen = values.seoTitle.length;
  const titleOver = titleLen > SEO_TITLE_MAX;
  const titleWarn = titleLen > SEO_TITLE_WARN && !titleOver;

  const metaLen = values.metaDescription.length;
  const metaOver = metaLen > META_DESC_MAX;
  const metaWarn = metaLen > META_DESC_WARN && !metaOver;

  const handleAutoSlug = () => {
    const generated = slugify(values.seoTitle || values.destinationName || '');
    onChange({ slug: generated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* SEO Title */}
      <div>
        <TextField
          label="SEO Title"
          value={values.seoTitle}
          onChange={(e) => onChange({ seoTitle: e.target.value })}
          placeholder="Best 7-Day Paris Itinerary | TravelOS"
          error={titleOver}
          helperText="Appears in browser tabs and search result headlines"
          aria-label="SEO page title"
        />
        <p
          style={{
            fontSize: '0.75rem',
            margin: '2px 0 0',
            textAlign: 'right',
            color: titleOver
              ? 'var(--cui-danger)'
              : titleWarn
              ? 'var(--cui-warning)'
              : 'var(--cui-secondary-color)',
          }}
          aria-live="polite"
        >
          {titleLen}/{SEO_TITLE_MAX}
          {titleOver && ' — over limit'}
          {titleWarn && ' — nearing limit'}
        </p>
      </div>

      {/* Meta Description */}
      <div>
        <TextareaField
          label="Meta Description"
          value={values.metaDescription}
          onChange={(e) => onChange({ metaDescription: e.target.value })}
          placeholder="Discover the perfect 7-day Paris itinerary with expertly curated..."
          minRows={2}
          error={metaOver}
          helperText="Summary shown in search result snippets (aim for 120–160 chars)"
          aria-label="Meta description"
        />
        <p
          style={{
            fontSize: '0.75rem',
            margin: '2px 0 0',
            textAlign: 'right',
            color: metaOver
              ? 'var(--cui-danger)'
              : metaWarn
              ? 'var(--cui-warning)'
              : 'var(--cui-secondary-color)',
          }}
          aria-live="polite"
        >
          {metaLen}/{META_DESC_MAX}
          {metaOver && ' — over limit'}
          {metaWarn && ' — nearing limit'}
        </p>
      </div>

      {/* Slug */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <TextField
            label="URL Slug"
            value={values.slug}
            onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            placeholder="paris-7-day-itinerary"
            helperText="Lowercase letters, numbers, hyphens only"
            aria-label="URL slug"
          />
        </div>
        <Button
          color="secondary"
          size="sm"
          onClick={handleAutoSlug}
          aria-label="Auto-generate slug from SEO title"
          style={{ marginBottom: 20, whiteSpace: 'nowrap' }}
        >
          <Icon name="Wand" size={14} />
          Auto-generate
        </Button>
      </div>

      {/* Canonical URL */}
      <TextField
        label="Canonical URL"
        type="url"
        value={values.canonicalUrl}
        onChange={(e) => onChange({ canonicalUrl: e.target.value })}
        placeholder="https://yourdomain.com/itineraries/paris-7-day"
        helperText="Prevents duplicate content issues — leave empty to use default"
        aria-label="Canonical URL"
      />

      {/* Robots */}
      <SelectField
        label="Robots Directive"
        value={values.robots}
        onChange={(e) => onChange({ robots: e.target.value })}
        helperText="Controls crawler indexing and link following behaviour"
      >
        {ROBOTS_OPTIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </SelectField>

      <hr style={{ border: 'none', borderTop: '1px solid var(--cui-border-color)', margin: '4px 0' }} />
      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--cui-body-color)', margin: 0 }}>
        Open Graph (Social Preview)
      </p>

      {/* OG Title */}
      <TextField
        label="OG Title"
        value={values.ogTitle}
        onChange={(e) => onChange({ ogTitle: e.target.value })}
        placeholder="Discover Paris in 7 Days"
        helperText="Title shown when shared on Facebook, LinkedIn, etc."
        aria-label="Open Graph title"
      />

      {/* OG Image URL */}
      <TextField
        label="OG Image URL"
        type="url"
        value={values.ogImageUrl}
        onChange={(e) => onChange({ ogImageUrl: e.target.value })}
        placeholder="https://cdn.example.com/og-paris.jpg"
        helperText="Recommended size: 1200×630px"
        aria-label="Open Graph image URL"
      />

      {/* Twitter Card */}
      <SelectField
        label="Twitter Card Type"
        value={values.twitterCard}
        onChange={(e) => onChange({ twitterCard: e.target.value as TwitterCard })}
        helperText="summary_large_image shows a large preview image on X/Twitter"
      >
        {TWITTER_CARD_OPTIONS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </SelectField>

    </div>
  );
}

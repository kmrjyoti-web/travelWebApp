'use client';
/**
 * AiSearchTab — Tab 2 of GeoSettings.
 * Manages AI-optimised search fields: summary, highlights, target queries,
 * competitor keywords, FAQs, and content freshness settings.
 */
import React from 'react';
import { TextareaField, TagsInput, Switch, TextField } from '@/shared/components';
import { FaqEditor } from './FaqEditor';
import type { GeoSettings } from './types';

const AI_SUMMARY_MAX = 300;

interface AiSearchTabProps {
  itineraryId: string;
  values: GeoSettings;
  onChange: (patch: Partial<GeoSettings>) => void;
}

export function AiSearchTab({ itineraryId, values, onChange }: AiSearchTabProps) {
  const summaryLen = values.aiSummary.length;
  const summaryOver = summaryLen > AI_SUMMARY_MAX;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* AI Summary */}
      <TextareaField
        label="AI Summary"
        value={values.aiSummary}
        onChange={(e) => onChange({ aiSummary: e.target.value })}
        placeholder="A compelling AI-optimised summary of this itinerary..."
        minRows={3}
        error={summaryOver}
        helperText={`${summaryLen}/${AI_SUMMARY_MAX} — used for AI indexing and voice search`}
        aria-label="AI summary for search optimisation"
      />

      {/* Key Highlights */}
      <TagsInput
        label="Key Highlights"
        value={values.keyHighlights}
        onChange={(tags) => onChange({ keyHighlights: tags })}
        placeholder="Add highlight and press Enter"
        maxTags={10}
        helperText="Up to 10 selling points for AI search cards"
      />

      {/* Target Queries */}
      <TagsInput
        label="Target Search Queries"
        value={values.targetQueries}
        onChange={(tags) => onChange({ targetQueries: tags })}
        placeholder="e.g. 7 day Paris tour"
        maxTags={10}
        helperText="Search phrases you want this itinerary to rank for"
      />

      {/* Competitor Keywords */}
      <TagsInput
        label="Competitor Keywords"
        value={values.competitorKeywords}
        onChange={(tags) => onChange({ competitorKeywords: tags })}
        placeholder="e.g. GetYourGuide Paris"
        maxTags={10}
        helperText="Keywords used by competitors — helps AI differentiation"
      />

      {/* FAQ Editor */}
      <div>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: '0 0 8px', color: 'var(--cui-body-color)' }}>
          FAQs (Structured Q&amp;A)
        </p>
        <FaqEditor
          itineraryId={itineraryId}
          value={values.faqs}
          onChange={(faqs) => onChange({ faqs })}
        />
      </div>

      {/* Freshness */}
      <div
        style={{
          padding: 12,
          border: '1px solid var(--cui-border-color)',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Switch
          checked={values.freshnessEnabled}
          onChange={(e) => onChange({ freshnessEnabled: e.target.checked })}
          label="Enable Content Freshness Date"
          description="Signal to search engines when this content was last reviewed"
          aria-label="Toggle content freshness date"
        />

        {values.freshnessEnabled && (
          <TextField
            label="Last Reviewed Date"
            type="date"
            value={values.freshnessDate ?? ''}
            onChange={(e) => onChange({ freshnessDate: e.target.value || null })}
            aria-label="Content freshness date"
          />
        )}
      </div>
    </div>
  );
}

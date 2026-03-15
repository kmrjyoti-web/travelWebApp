'use client';
/**
 * SocialVoiceTab — Tab 5 of GeoSettingsDrawer.
 * Manages social discovery and voice search optimisation fields.
 */
import React from 'react';
import { TextareaField, TagsInput } from '@/shared/components';
import type { GeoSettings } from './types';

const SPEAKABLE_MAX_WORDS = 100;
const SPEAKABLE_MAX_CHARS = 500;

interface SocialVoiceTabProps {
  values: GeoSettings;
  onChange: (patch: Partial<GeoSettings>) => void;
}

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export function SocialVoiceTab({ values, onChange }: SocialVoiceTabProps) {
  const wordCount = countWords(values.speakableSnippet);
  const charCount = values.speakableSnippet.length;
  const wordOver = wordCount > SPEAKABLE_MAX_WORDS;
  const charOver = charCount > SPEAKABLE_MAX_CHARS;
  const speakableError = wordOver || charOver;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Social Hashtags */}
      <TagsInput
        label="Social Hashtags"
        value={values.socialHashtags}
        onChange={(tags) => onChange({ socialHashtags: tags })}
        placeholder="e.g. #Paris, #Travel"
        helperText="Used in social media metadata and Open Graph tags"
      />

      {/* Location Tags */}
      <TagsInput
        label="Location Tags"
        value={values.locationTags}
        onChange={(tags) => onChange({ locationTags: tags })}
        placeholder="e.g. Eiffel Tower, Montmartre"
        helperText="Specific landmarks and areas for geo-tagging on social platforms"
      />

      {/* Voice Search Phrases */}
      <TagsInput
        label="Voice Search Phrases"
        value={values.voiceSearchPhrases}
        onChange={(tags) => onChange({ voiceSearchPhrases: tags })}
        placeholder="e.g. best trip to Paris for families"
        helperText="Natural language phrases optimised for Alexa, Google Assistant, Siri"
      />

      {/* Speakable Snippet */}
      <div>
        <TextareaField
          label="Speakable Snippet"
          size="sm"
          value={values.speakableSnippet}
          onChange={(e) => onChange({ speakableSnippet: e.target.value })}
          placeholder="A short, conversational description read aloud by voice assistants..."
          minRows={3}
          error={speakableError}
          helperText="Text-to-speech optimised content for Google's Speakable schema"
          aria-label="Speakable snippet for voice assistants"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: wordOver ? 'var(--cui-danger)' : 'var(--cui-secondary-color)',
            }}
            aria-live="polite"
          >
            {wordCount}/{SPEAKABLE_MAX_WORDS} words
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: charOver ? 'var(--cui-danger)' : 'var(--cui-secondary-color)',
            }}
            aria-live="polite"
          >
            {charCount}/{SPEAKABLE_MAX_CHARS} chars
          </span>
        </div>
      </div>

    </div>
  );
}

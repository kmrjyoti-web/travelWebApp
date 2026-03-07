'use client';
/**
 * JsonLdPreview — collapsible structured data preview with copy-to-clipboard.
 * Debounces preview re-generation by 500ms after settings change.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { GeoSettings } from './types';

interface JsonLdPreviewProps {
  itineraryId: string;
  settings: GeoSettings;
}

function buildLocalJsonLd(settings: GeoSettings): object {
  return {
    '@context': 'https://schema.org',
    '@type': settings.schemaType,
    name: settings.destinationName || 'Itinerary',
    description: settings.aiSummary || settings.metaDescription,
    ...(settings.destinationLat && settings.destinationLng
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: settings.destinationLat,
            longitude: settings.destinationLng,
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: settings.priceRange,
      priceCurrency: settings.currency,
      availability: `https://schema.org/${settings.availability}`,
    },
    provider: {
      '@type': 'Organization',
      name: settings.providerName,
      url: settings.providerUrl,
    },
    ...(settings.durationIso ? { duration: settings.durationIso } : {}),
    ...(settings.faqs.length > 0
      ? {
          mainEntity: settings.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : {}),
  };
}

export function JsonLdPreview({ settings }: JsonLdPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jsonLd, setJsonLd] = useState<object>(() => buildLocalJsonLd(settings));

  // Debounce: rebuild JSON-LD 500ms after settings change
  const rebuild = useCallback(() => {
    setJsonLd(buildLocalJsonLd(settings));
  }, [settings]);

  useEffect(() => {
    const timer = setTimeout(rebuild, 500);
    return () => clearTimeout(timer);
  }, [rebuild]);

  const jsonString = JSON.stringify(jsonLd, null, 2);

  const handleCopy = () => {
    void navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        borderTop: '1px solid var(--cui-border-color)',
        paddingTop: 12,
        marginTop: 8,
      }}
    >
      {/* Toggle header */}
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="json-ld-content"
        onClick={() => setExpanded((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          color: 'var(--cui-body-color)',
          fontWeight: 600,
          fontSize: '0.875rem',
          width: '100%',
        }}
      >
        <Icon name={expanded ? 'ChevronDown' : 'ChevronRight'} size={16} />
        JSON-LD Structured Data Preview
      </button>

      {/* Collapsible content */}
      {expanded && (
        <div id="json-ld-content" style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
            <Button
              color="secondary"
              size="sm"
              onClick={handleCopy}
              aria-label="Copy JSON-LD to clipboard"
            >
              <Icon name={copied ? 'Check' : 'Copy'} size={14} />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <pre
            style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: 16,
              borderRadius: 8,
              fontSize: '0.75rem',
              lineHeight: 1.6,
              overflowX: 'auto',
              maxHeight: 320,
              overflowY: 'auto',
              margin: 0,
              whiteSpace: 'pre',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
            aria-label="JSON-LD structured data"
          >
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}

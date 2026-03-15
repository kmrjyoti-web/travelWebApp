'use client';
import React, { useState } from 'react';
import { Button, TextField, SelectField, TextareaField, Switch } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';

const hint: React.CSSProperties = { fontSize: '0.7rem', color: 'var(--cui-secondary-color)', marginTop: 3 };
const card: React.CSSProperties = { background: 'var(--cui-card-bg, #fff)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' };

const ROBOTS_OPTIONS = ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'];
const TWITTER_CARDS  = ['summary', 'summary_large_image', 'app', 'player'];

export function SectionSEOSettings() {
  const seo    = usePublishStore((s) => s.data.seoSettings);
  const update = usePublishStore((s) => s.updateSection);
  const [kwDraft, setKwDraft] = useState('');

  const addKeyword = () => {
    if (kwDraft.trim()) {
      update('seoSettings', { ...seo, keywords: [...seo.keywords, kwDraft.trim()] });
      setKwDraft('');
    }
  };

  // Character count helpers
  const titleLen   = seo.title.length;
  const metaLen    = seo.metaDescription.length;
  const titleOk    = titleLen >= 30 && titleLen <= 60;
  const metaOk     = metaLen >= 80 && metaLen <= 160;

  return (
    <div>
      {/* Basic SEO */}
      <div style={card}>
        <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Basic SEO</p>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cui-body-color)' }}>SEO Title</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 400, color: titleOk ? '#16a34a' : titleLen > 60 ? '#dc2626' : 'var(--cui-secondary-color)' }}>
              {titleLen}/60 chars
            </span>
          </div>
          <TextField label="SEO Title" variant="outlined" size="xs" startIcon="FileText" value={seo.title}
            onChange={(e) => update('seoSettings', { ...seo, title: e.target.value })} />
          <p style={hint}>Appears as the clickable heading in Google search results.</p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cui-body-color)' }}>Meta Description</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 400, color: metaOk ? '#16a34a' : metaLen > 160 ? '#dc2626' : 'var(--cui-secondary-color)' }}>
              {metaLen}/160 chars
            </span>
          </div>
          <TextareaField label="Meta Description" variant="outlined" size="sm" minRows={3}
            value={seo.metaDescription}
            onChange={(e) => update('seoSettings', { ...seo, metaDescription: e.target.value })} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cui-body-color)', display: 'block', marginBottom: 4 }}>Keywords</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
            {seo.keywords.map((kw, i) => (
              <span key={i} style={{ background: 'var(--cui-light)', padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', display: 'flex', gap: 4 }}>
                {kw}<span style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => update('seoSettings', { ...seo, keywords: seo.keywords.filter((_, j) => j !== i) })}>×</span>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1 }}>
              <TextField label="Add keyword" variant="outlined" size="xs" startIcon="Search" value={kwDraft}
                onChange={(e) => setKwDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }} />
            </div>
            <Button size="xs" color="secondary" onClick={addKeyword} type="button"><Icon name="Plus" size={12} /></Button>
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div style={card}>
        <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Open Graph (Social Sharing)</p>
        <div style={{ marginBottom: '0.875rem' }}>
          <TextField label="OG Title" variant="outlined" size="xs" startIcon="FileText" value={seo.ogTitle} onChange={(e) => update('seoSettings', { ...seo, ogTitle: e.target.value })} />
        </div>
        <div style={{ marginBottom: '0.875rem' }}>
          <TextareaField label="OG Description" variant="outlined" size="sm" minRows={3} value={seo.ogDescription}
            onChange={(e) => update('seoSettings', { ...seo, ogDescription: e.target.value })} />
        </div>
        <div>
          <TextField label="OG Image URL" variant="outlined" size="xs" startIcon="Link" type="url" value={seo.ogImage} onChange={(e) => update('seoSettings', { ...seo, ogImage: e.target.value })} />
          {seo.ogImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={seo.ogImage} alt="OG preview" style={{ height: 80, marginTop: 6, borderRadius: 4, objectFit: 'cover' }} />
          )}
        </div>
      </div>

      {/* Technical SEO */}
      <div style={card}>
        <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Technical SEO</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Canonical URL" variant="outlined" size="xs" startIcon="Link" type="url" value={seo.canonicalUrl} onChange={(e) => update('seoSettings', { ...seo, canonicalUrl: e.target.value })} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <SelectField label="Robots" variant="outlined" size="xs" value={seo.robots} onChange={(e) => update('seoSettings', { ...seo, robots: e.target.value })}>
              {ROBOTS_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </SelectField>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <SelectField label="Twitter Card" variant="outlined" size="xs" value={seo.twitterCard} onChange={(e) => update('seoSettings', { ...seo, twitterCard: e.target.value })}>
              {TWITTER_CARDS.map((t) => <option key={t} value={t}>{t}</option>)}
            </SelectField>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
            <Switch label="Enable Structured Data (JSON-LD)" checked={seo.structuredDataEnabled} onChange={(e) => update('seoSettings', { ...seo, structuredDataEnabled: e.target.checked })} />
          </div>
        </div>
      </div>

      {/* SERP Preview */}
      {(seo.title || seo.metaDescription) && (
        <div style={{ background: 'var(--cui-light)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--cui-secondary-color)' }}>SEARCH PREVIEW</p>
          <p style={{ color: '#1a0dab', fontSize: '0.9rem', fontWeight: 500, margin: '0 0 2px' }}>{seo.title || 'Page Title'}</p>
          <p style={{ color: '#006621', fontSize: '0.75rem', margin: '0 0 2px' }}>{seo.canonicalUrl || 'https://yoursite.com/packages/…'}</p>
          <p style={{ color: 'var(--cui-body-color)', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{seo.metaDescription || 'Meta description will appear here…'}</p>
        </div>
      )}
    </div>
  );
}

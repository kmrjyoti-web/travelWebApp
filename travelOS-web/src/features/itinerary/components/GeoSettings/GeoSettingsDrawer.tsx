'use client';
/**
 * GeoSettingsDrawer — Main Advanced GEO & Visibility Settings panel.
 * Offcanvas with 5 tabs: Schema | AI Search | SEO | Geo-Target | Social.
 * Renders GeoScoreRing, GeoTabBar, tab content, JSON-LD preview, and footer.
 */
import React, { useState, useEffect } from 'react';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  OffcanvasBody,
  Button,
} from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { GeoScoreRing } from './GeoScoreRing';
import { GeoTabBar } from './GeoTabBar';
import type { TabKey } from './GeoTabBar';
import { SchemaMarkupTab } from './SchemaMarkupTab';
import { AiSearchTab } from './AiSearchTab';
import { SeoControlsTab } from './SeoControlsTab';
import { GeoTargetingTab } from './GeoTargetingTab';
import { SocialVoiceTab } from './SocialVoiceTab';
import { JsonLdPreview } from './JsonLdPreview';
import { useGeoSettings } from './hooks/useGeoSettings';
import { useGeoAutoFill } from './hooks/useGeoAutoFill';
import { GEO_DEFAULTS } from './types';
import type { GeoSettings, GeoScoreTier } from './types';

interface GeoSettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
  itineraryId: string;
}

function scoreTier(score: number): GeoScoreTier {
  if (score >= 85) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function tierRecommendation(tier: GeoScoreTier): string | undefined {
  if (tier === 'poor') return 'Add destination, schema type, and SEO title to improve score';
  if (tier === 'fair') return 'Complete AI search fields and geo-targeting for a higher score';
  return undefined;
}

export function GeoSettingsDrawer({ visible, onClose, itineraryId }: GeoSettingsDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('schema');
  const [form, setForm] = useState<GeoSettings>(GEO_DEFAULTS);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const { data, isLoading, updateSettings, isUpdating } = useGeoSettings(itineraryId);
  const { autoFill, isAutoFilling } = useGeoAutoFill(itineraryId);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleChange = (patch: Partial<GeoSettings>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(form);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
      console.error('GeoSettings save failed');
    }
  };

  const handleAutoFill = async () => {
    try {
      const filled = await autoFill();
      setForm(filled);
    } catch {
      console.error('GeoSettings auto-fill failed');
    }
  };

  const tier = scoreTier(form.geoScore);

  return (
    <Offcanvas
      placement="end"
      visible={visible}
      onHide={onClose}
      aria-labelledby="geo-settings-title"
      style={{ width: 600, maxWidth: '100vw' }}
    >
      <OffcanvasHeader style={{ borderBottom: '1px solid var(--cui-border-color)', paddingBottom: 12 }}>
        <OffcanvasTitle id="geo-settings-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="Globe" size={20} />
            GEO &amp; Visibility Settings
          </span>
        </OffcanvasTitle>
      </OffcanvasHeader>

      <OffcanvasBody style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Score Ring */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 24px 8px', borderBottom: '1px solid var(--cui-border-color)' }}>
          <GeoScoreRing score={form.geoScore} tier={tier} recommendation={tierRecommendation(tier)} />
        </div>

        {/* Tab Navigation */}
        <GeoTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {isLoading ? (
            <div
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: 'var(--cui-secondary-color)' }}
              aria-busy="true"
              aria-label="Loading GEO settings"
            >
              <Icon name="LoaderCircle" size={32} />
            </div>
          ) : (
            <>
              <div id="geo-tab-panel-schema" role="tabpanel" aria-labelledby="geo-tab-schema" hidden={activeTab !== 'schema'}>
                {activeTab === 'schema' && <SchemaMarkupTab values={form} onChange={handleChange} />}
              </div>
              <div id="geo-tab-panel-ai" role="tabpanel" aria-labelledby="geo-tab-ai" hidden={activeTab !== 'ai'}>
                {activeTab === 'ai' && <AiSearchTab itineraryId={itineraryId} values={form} onChange={handleChange} />}
              </div>
              <div id="geo-tab-panel-seo" role="tabpanel" aria-labelledby="geo-tab-seo" hidden={activeTab !== 'seo'}>
                {activeTab === 'seo' && <SeoControlsTab values={form} onChange={handleChange} />}
              </div>
              <div id="geo-tab-panel-geo" role="tabpanel" aria-labelledby="geo-tab-geo" hidden={activeTab !== 'geo'}>
                {activeTab === 'geo' && <GeoTargetingTab values={form} onChange={handleChange} />}
              </div>
              <div id="geo-tab-panel-social" role="tabpanel" aria-labelledby="geo-tab-social" hidden={activeTab !== 'social'}>
                {activeTab === 'social' && <SocialVoiceTab values={form} onChange={handleChange} />}
              </div>
            </>
          )}

          {!isLoading && <JsonLdPreview itineraryId={itineraryId} settings={form} />}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--cui-border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            background: 'var(--cui-body-bg)',
          }}
        >
          <Button
            color="primary"
            onClick={handleAutoFill}
            disabled={isAutoFilling || isLoading}
            aria-label="AI auto-fill all GEO fields"
          >
            {isAutoFilling
              ? <><Icon name="LoaderCircle" size={16} /> Auto-Filling…</>
              : <><Icon name="Sparkles" size={16} /> AI Auto-Fill All</>}
          </Button>

          <Button
            color="success"
            onClick={handleSave}
            disabled={isUpdating || isLoading}
            aria-label="Save GEO settings"
          >
            {isUpdating
              ? <><Icon name="LoaderCircle" size={16} /> Saving…</>
              : <><Icon name="Save" size={16} /> Save</>}
          </Button>

          {saveStatus === 'saved' && (
            <span style={{ fontSize: '0.8rem', color: 'var(--cui-success)', display: 'flex', alignItems: 'center', gap: 4 }} role="status">
              <Icon name="CircleCheck" size={14} /> Saved successfully
            </span>
          )}
          {saveStatus === 'error' && (
            <span style={{ fontSize: '0.8rem', color: 'var(--cui-danger)', display: 'flex', alignItems: 'center', gap: 4 }} role="alert">
              <Icon name="CircleAlert" size={14} /> Save failed — please retry
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel and close GEO settings"
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--cui-secondary-color)',
              fontSize: '0.875rem',
              textDecoration: 'underline',
              padding: '4px 8px',
            }}
          >
            Cancel
          </button>
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
}

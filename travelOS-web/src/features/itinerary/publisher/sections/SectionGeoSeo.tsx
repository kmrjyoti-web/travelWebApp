'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import { GeoScoreRing } from '../../components/GeoSettings/GeoScoreRing';
import { GeoTabBar } from '../../components/GeoSettings/GeoTabBar';
import type { TabKey } from '../../components/GeoSettings/GeoTabBar';
import { SchemaMarkupTab } from '../../components/GeoSettings/SchemaMarkupTab';
import { AiSearchTab } from '../../components/GeoSettings/AiSearchTab';
import { SeoControlsTab } from '../../components/GeoSettings/SeoControlsTab';
import { GeoTargetingTab } from '../../components/GeoSettings/GeoTargetingTab';
import { SocialVoiceTab } from '../../components/GeoSettings/SocialVoiceTab';
import { JsonLdPreview } from '../../components/GeoSettings/JsonLdPreview';
import { useGeoSettings } from '../../components/GeoSettings/hooks/useGeoSettings';
import { useGeoAutoFill } from '../../components/GeoSettings/hooks/useGeoAutoFill';
import { GEO_DEFAULTS } from '../../components/GeoSettings/types';
import type { GeoSettings, GeoScoreTier } from '../../components/GeoSettings/types';

function scoreTier(score: number): GeoScoreTier {
  if (score >= 85) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function tierRecommendation(tier: GeoScoreTier): string | undefined {
  if (tier === 'poor')  return 'Add destination, schema type, and SEO title to improve score';
  if (tier === 'fair')  return 'Complete AI search fields and geo-targeting for a higher score';
  return undefined;
}

export function SectionGeoSeo() {
  const packageId = usePublishStore((s) => s.packageId ?? '');

  const [activeTab, setActiveTab] = useState<TabKey>('schema');
  const [form, setForm] = useState<GeoSettings>(GEO_DEFAULTS);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const { data, isLoading, updateSettings, isUpdating } = useGeoSettings(packageId);
  const { autoFill, isAutoFilling } = useGeoAutoFill(packageId);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const handleChange = (patch: Partial<GeoSettings>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    try {
      await updateSettings(form);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  const handleAutoFill = async () => {
    try { const filled = await autoFill(); setForm(filled); }
    catch { console.error('GEO auto-fill failed'); }
  };

  const tier = scoreTier(form.geoScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Score Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px', borderBottom: '1px solid var(--cui-border-color)' }}>
        <GeoScoreRing score={form.geoScore} tier={tier} recommendation={tierRecommendation(tier)} />
      </div>

      {/* Tab bar */}
      <GeoTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <div style={{ padding: '20px 0', minHeight: 300 }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: 'var(--cui-secondary-color)' }}>
            <Icon name="LoaderCircle" size={28} />
          </div>
        ) : (
          <>
            {activeTab === 'schema' && <SchemaMarkupTab values={form} onChange={handleChange} />}
            {activeTab === 'ai'     && <AiSearchTab itineraryId={packageId} values={form} onChange={handleChange} />}
            {activeTab === 'seo'    && <SeoControlsTab values={form} onChange={handleChange} />}
            {activeTab === 'geo'    && <GeoTargetingTab values={form} onChange={handleChange} />}
            {activeTab === 'social' && <SocialVoiceTab values={form} onChange={handleChange} />}
          </>
        )}
      </div>

      {/* JSON-LD Preview */}
      {!isLoading && <JsonLdPreview itineraryId={packageId} settings={form} />}

      {/* Action bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--cui-border-color)',
      }}>
        <Button color="primary" onClick={handleAutoFill} disabled={isAutoFilling || isLoading} aria-label="AI auto-fill all GEO fields">
          {isAutoFilling
            ? <><Icon name="LoaderCircle" size={15} /> Auto-Filling…</>
            : <><Icon name="Sparkles" size={15} /> AI Auto-Fill All</>}
        </Button>

        <Button color="success" onClick={handleSave} disabled={isUpdating || isLoading} aria-label="Save GEO & SEO settings">
          {isUpdating
            ? <><Icon name="LoaderCircle" size={15} /> Saving…</>
            : <><Icon name="Save" size={15} /> Save Settings</>}
        </Button>

        {saveStatus === 'saved' && (
          <span style={{ fontSize: '0.8rem', color: 'var(--cui-success)', display: 'flex', alignItems: 'center', gap: 4 }} role="status">
            <Icon name="CircleCheck" size={14} /> Saved
          </span>
        )}
        {saveStatus === 'error' && (
          <span style={{ fontSize: '0.8rem', color: 'var(--cui-danger)', display: 'flex', alignItems: 'center', gap: 4 }} role="alert">
            <Icon name="CircleAlert" size={14} /> Save failed
          </span>
        )}
      </div>
    </div>
  );
}

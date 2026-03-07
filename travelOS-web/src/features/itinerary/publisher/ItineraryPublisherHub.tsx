'use client';
import React, { useCallback } from 'react';
import { Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import { useSidePanelStore } from '@/shared/components/SidePanel';
import { usePublishStore } from './stores/publishStore';
import { useAutoSave, usePublishPackage, usePackageDetail } from './hooks/usePublish';
import { PUBLISH_SECTIONS } from './types/publish.types';
import type { PublishSectionId } from './types/publish.types';
import { SectionImageGallery }        from './sections/SectionImageGallery';
import { SectionGeneralInfo }          from './sections/SectionGeneralInfo';
import { SectionDailyItinerary }       from './sections/SectionDailyItinerary';
import { SectionAccommodation }        from './sections/SectionAccommodation';
import { SectionTransportation }       from './sections/SectionTransportation';
import { SectionWeatherAttire }        from './sections/SectionWeatherAttire';
import { SectionInclusionsExclusions } from './sections/SectionInclusionsExclusions';
import { SectionLocalEvents }          from './sections/SectionLocalEvents';
import { SectionAttractions }          from './sections/SectionAttractions';
import { SectionSupportEmergency }     from './sections/SectionSupportEmergency';
import { SectionPriceReference }       from './sections/SectionPriceReference';
import { SectionVisaRequirements }     from './sections/SectionVisaRequirements';
import { SectionTripPreferences }      from './sections/SectionTripPreferences';
import { SectionSearchDetails }        from './sections/SectionSearchDetails';
import { SectionGeoSeo }               from './sections/SectionGeoSeo';
import { SectionItineraryMapping }     from './sections/SectionItineraryMapping';
import { SectionPublishSettings }      from './sections/SectionPublishSettings';

const SECTION_MAP: Record<PublishSectionId, React.ComponentType> = {
  gallery:               SectionImageGallery,
  generalInfo:           SectionGeneralInfo,
  dailyItinerary:        SectionDailyItinerary,
  accommodation:         SectionAccommodation,
  transportation:        SectionTransportation,
  weatherAttire:         SectionWeatherAttire,
  inclusionsExclusions:  SectionInclusionsExclusions,
  localEvents:           SectionLocalEvents,
  attractions:           SectionAttractions,
  supportEmergency:      SectionSupportEmergency,
  priceReference:        SectionPriceReference,
  visaRequirements:      SectionVisaRequirements,
  tripPreferences:       SectionTripPreferences,
  searchDetails:         SectionSearchDetails,
  geoSeo:                SectionGeoSeo,
  itineraryMapping:      SectionItineraryMapping,
  publishSettings:       SectionPublishSettings,
};

interface ItineraryPublisherHubProps {
  editId?: string;
  panelId?: string;
}


export function ItineraryPublisherHub({ editId, panelId }: ItineraryPublisherHubProps) {
  const closePanel = useSidePanelStore((s) => s.closePanel);

  const isDirty          = usePublishStore((s) => s.isDirty);
  const packageId        = usePublishStore((s) => s.packageId);
  const activeSection    = usePublishStore((s) => s.activeSection);
  const setActiveSection = usePublishStore((s) => s.setActiveSection);
  const data             = usePublishStore((s) => s.data);

  const { isLoading: isLoadingPackage } = usePackageDetail(editId ?? '');
  const { save, isPending: isSaving }   = useAutoSave();
  const publishMutation                 = usePublishPackage();

  const handlePublish = useCallback(async () => {
    await save();
    if (packageId) await publishMutation.mutateAsync(packageId);
  }, [save, packageId, publishMutation]);

  // Completion map
  const completionMap: Record<PublishSectionId, boolean> = {
    gallery:               data.gallery.length > 0,
    generalInfo:           !!data.generalInfo.title,
    dailyItinerary:        data.dailyItinerary.days.length > 0,
    accommodation:         data.accommodation.length > 0,
    transportation:
      data.transportation.flights.length > 0 ||
      data.transportation.trains.length > 0  ||
      data.transportation.other.length > 0,
    weatherAttire:         !!data.weatherAttire.bestTimeToVisit,
    inclusionsExclusions:  data.inclusionsExclusions.inclusions.length > 0,
    localEvents:           data.localEvents.length > 0,
    attractions:           data.attractions.length > 0,
    supportEmergency:      !!data.supportEmergency.emergencyNumber,
    priceReference:        data.priceReference.tiers.length > 0,
    visaRequirements:      !!data.visaRequirements.type,
    tripPreferences:       data.tripPreferences.tags.length > 0 || !!data.tripPreferences.ageGroup,
    searchDetails:         !!data.searchDetails.destinationCountry,
    geoSeo:                false,
    itineraryMapping:      data.itineraryMapping.waypoints.length > 0,
    publishSettings:       data.publishSettings.status !== 'draft',
  };
  const completedCount = Object.values(completionMap).filter(Boolean).length;

  const ActiveSection = SECTION_MAP[activeSection];
  const activeSecMeta = PUBLISH_SECTIONS.find((s) => s.id === activeSection);

  return (
    // Root: full height flex column — split-pane takes flex:1, footer sticks to bottom
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Split pane (flex: 1) ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left sidebar — section nav ONLY */}
        <aside style={{
          width: 220, flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Sidebar header */}
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="PackageCheck" size={13} style={{ color: '#4f46e5' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5' }}>
                {editId ? 'Edit Package' : 'Publish Package'}
              </span>
            </div>
            {isDirty && (
              <p style={{ margin: '4px 0 0', fontSize: '0.65rem', color: '#f59e0b' }}>● Unsaved changes</p>
            )}
            {/* Progress */}
            <div style={{ marginTop: 6 }}>
              <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: '#4f46e5', borderRadius: 2,
                  width: `${(completedCount / PUBLISH_SECTIONS.length) * 100}%`,
                  transition: 'width 0.3s',
                }} />
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.6rem', color: '#9ca3af' }}>
                {completedCount}/{PUBLISH_SECTIONS.length} sections filled
              </p>
            </div>
          </div>

          {/* Section list */}
          <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
            {PUBLISH_SECTIONS.map((sec) => {
              const done   = completionMap[sec.id];
              const active = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '0.48rem 1rem',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: active ? '#f0f0ff' : 'transparent',
                    borderLeft: `3px solid ${active ? '#4f46e5' : 'transparent'}`,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = '#f8f9ff'; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <Icon
                    name={sec.icon as IconName}
                    size={14}
                    style={{ color: active ? '#4f46e5' : '#9ca3af', flexShrink: 0 }}
                  />
                  <span style={{
                    flex: 1, fontSize: '0.78rem', fontWeight: active ? 600 : 400,
                    color: active ? '#4f46e5' : '#374151',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {sec.label}
                  </span>
                  {done && <Icon name="Check" size={11} style={{ color: '#22c55e', flexShrink: 0 }} />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right — active section content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f5f6fa' }}>
          {/* Section title bar */}
          <div style={{
            padding: '0.65rem 1.25rem',
            background: '#fff', borderBottom: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                {activeSecMeta?.label}
              </h2>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280' }}>
                {activeSecMeta?.description}
              </p>
            </div>
            {/* Prev / Next */}
            {(() => {
              const idx  = PUBLISH_SECTIONS.findIndex((s) => s.id === activeSection);
              const prev = PUBLISH_SECTIONS[idx - 1];
              const next = PUBLISH_SECTIONS[idx + 1];
              return (
                <div style={{ display: 'flex', gap: 4 }}>
                  <button type="button" disabled={!prev} onClick={() => prev && setActiveSection(prev.id)}
                    title={prev?.label} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: prev ? 'pointer' : 'default', opacity: prev ? 1 : 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="ChevronLeft" size={13} style={{ color: '#374151' }} />
                  </button>
                  <button type="button" disabled={!next} onClick={() => next && setActiveSection(next.id)}
                    title={next?.label} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: next ? 'pointer' : 'default', opacity: next ? 1 : 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="ChevronRight" size={13} style={{ color: '#374151' }} />
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Section form — scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {isLoadingPackage ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, color: '#9ca3af', gap: 8 }}>
                <Icon name="LoaderCircle" size={18} /> Loading…
              </div>
            ) : (
              <ActiveSection />
            )}
          </div>
        </main>
      </div>

      {/* ── Footer — Save + Publish (sticks to bottom of drawer body) ──────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
        padding: '10px 16px',
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        flexShrink: 0,
      }}>
        {panelId && (
          <Button color="secondary" variant="ghost" size="sm" onClick={() => closePanel(panelId)}>
            Cancel
          </Button>
        )}

        <Button color="secondary" variant="outline" size="sm"
          leftIcon={isSaving ? 'LoaderCircle' : 'Save'}
          loading={isSaving} disabled={isSaving}
          onClick={save}>
          {isSaving ? 'Saving…' : 'Save Draft'}
        </Button>

        <Button color="primary" size="sm"
          leftIcon={publishMutation.isPending ? 'LoaderCircle' : 'Send'}
          loading={publishMutation.isPending}
          disabled={isSaving || publishMutation.isPending || !packageId}
          onClick={handlePublish}>
          {publishMutation.isPending ? 'Publishing…' : 'Publish Package'}
        </Button>
      </div>
    </div>
  );
}

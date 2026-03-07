'use client';
import React, { useRef } from 'react';
import { Button, TextField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import { useUploadImage } from '../hooks/usePublish';
import type { PackageImage, MarketingAssetSize } from '../types/publish.types';

/* ── Constants ─────────────────────────────────────────────────── */
const MARKETING_ASSETS: { id: MarketingAssetSize; label: string }[] = [
  { id: 'vertical_feature',    label: 'Vertical Feature'    },
  { id: 'standard_landscape',  label: 'Standard Landscape'  },
  { id: 'large_feature',       label: 'Large Feature'       },
  { id: 'portrait',            label: 'Portrait'            },
  { id: 'panoramic_banner',    label: 'Panoramic Banner'    },
];

/* ── Gallery Slot ───────────────────────────────────────────────── */
function GallerySlot({
  index, image, isMarketing, onUpload, onRemove, onAltChange,
}: {
  index: number;
  image: PackageImage | null;
  isMarketing: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onAltChange: (alt: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', overflow: 'hidden', marginBottom: 12 }}>
      {/* Slot header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.875rem', background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>16:9</span>
        {isMarketing && (
          <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#ede9fe', color: '#4f46e5', border: '1px solid #c4b5fd' }}>
            Marketing Asset
          </span>
        )}
      </div>

      <div style={{ padding: '0.875rem' }}>
        {/* Empty / filled slot label */}
        <p style={{ margin: '0 0 6px', fontSize: '0.65rem', fontWeight: 800, color: image ? '#10b981' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {image ? 'Image Set' : 'Empty Slot'}
        </p>

        {/* Image or placeholder */}
        {image ? (
          <div style={{ position: 'relative', marginBottom: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.altText ?? image.caption}
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 6, display: 'block' }} />
            {image.isPrimary && (
              <span style={{ position: 'absolute', top: 6, left: 6, background: '#4f46e5', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
                COVER
              </span>
            )}
            <button onClick={onRemove} style={{ position: 'absolute', top: 6, right: 6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="X" size={12} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            style={{ width: '100%', aspectRatio: '16/9', background: '#f3f4f6', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1.5px dashed #d1d5db', marginBottom: 10 }}>
            <Icon name="Image" size={24} style={{ color: '#d1d5db', marginBottom: 6 }} />
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>Waiting for Content...</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#c4c4c4' }}>Upload Image or Click Generate</p>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />

        {/* Alt text */}
        <div style={{ marginBottom: 8 }}>
          <TextField label="Alt Text" variant="outlined" size="sm" value={image?.altText ?? `Gallery Slot ${index + 1}`} onChange={(e) => onAltChange(e.target.value)} />
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Prefix: 16:9_</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => fileRef.current?.click()} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              <Icon name="Upload" size={13} />
            </button>
            <button style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #4f46e5', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}
              title="Generate AI image">
              <Icon name="Sparkles" size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ───────────────────────────────────────────────── */
export function SectionImageGallery() {
  const gallery  = usePublishStore((s) => s.data.gallery);
  const gs       = usePublishStore((s) => s.data.gallerySettings);
  const update   = usePublishStore((s) => s.updateSection);
  const { mutateAsync: upload, isPending } = useUploadImage();
  const coverRef = useRef<HTMLInputElement>(null);

  const setGs = (p: Partial<typeof gs>) => update('gallerySettings', { ...gs, ...p });

  const toggleAsset = (id: MarketingAssetSize) => {
    const next = gs.marketingAssets.includes(id)
      ? gs.marketingAssets.filter((x) => x !== id)
      : [...gs.marketingAssets, id];
    setGs({ marketingAssets: next });
  };

  const handleSlotUpload = async (slotIdx: number, file: File) => {
    const res = await upload(file);
    const newImg: PackageImage = { url: res.data.url, caption: `Gallery Slot ${slotIdx + 1}`, isPrimary: gallery.length === 0 && slotIdx === 0, altText: `Gallery Slot ${slotIdx + 1}` };
    const updated = [...gallery];
    updated[slotIdx] = newImg;
    update('gallery', updated.filter(Boolean));
  };

  const handleSlotRemove = (slotIdx: number) => {
    const updated = gallery.filter((_, i) => i !== slotIdx);
    if (updated.length && !updated.some((x) => x.isPrimary)) updated[0].isPrimary = true;
    update('gallery', updated);
  };

  const handleAltChange = (slotIdx: number, alt: string) => {
    const updated = gallery.map((img, i) => i === slotIdx ? { ...img, altText: alt } : img);
    update('gallery', updated);
  };

  const handleCoverUpload = async (file: File) => {
    const res = await upload(file);
    setGs({ coverImageUrl: res.data.url });
  };

  return (
    <div>
      {/* ── Settings Panel ── */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', padding: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#111827' }}>Image Gallery Settings</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>Configure and generate AI image prompts.</p>
          </div>
          <Button color="primary" variant="outline" size="sm" leftIcon="Sparkles">
            Generate Content (AI)
          </Button>
        </div>

        {/* 1. General Gallery */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>1. General Gallery</p>
          <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#6b7280' }}>Number of Images (Landscape 16:9)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <button onClick={() => setGs({ count: Math.max(1, gs.count - 1) })} style={{ width: 36, height: 36, borderRadius: '8px 0 0 8px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', fontSize: '1rem' }}>
              <Icon name="ChevronDown" size={16} />
            </button>
            <div style={{ width: 56, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb', borderLeft: 'none', borderRight: 'none', fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
              {gs.count}
            </div>
            <button onClick={() => setGs({ count: Math.min(20, gs.count + 1) })} style={{ width: 36, height: 36, borderRadius: '0 8px 8px 0', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', fontSize: '1rem' }}>
              <Icon name="ChevronUp" size={16} />
            </button>
          </div>
        </div>

        {/* 2. Marketing Assets */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>2. Marketing Assets</p>
          <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#6b7280' }}>Select specific sizes to generate.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            {MARKETING_ASSETS.map((a) => (
              <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: '#374151' }}>
                <div onClick={() => toggleAsset(a.id)} style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  border: `2px solid ${gs.marketingAssets.includes(a.id) ? '#4f46e5' : '#d1d5db'}`,
                  background: gs.marketingAssets.includes(a.id) ? '#4f46e5' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {gs.marketingAssets.includes(a.id) && <Icon name="Check" size={11} style={{ color: '#fff' }} />}
                </div>
                {a.label}
              </label>
            ))}
          </div>
        </div>

        {/* Trip Cover Image */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 120, height: 80, borderRadius: 8, background: '#f3f4f6', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
            {gs.coverImageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={gs.coverImageUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <Icon name="Image" size={28} style={{ color: '#d1d5db' }} />
            }
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>Trip Cover Image</p>
            <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#9ca3af' }}>Main slider image for the itinerary (1920×600 recommended).</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button color="primary" variant="outline" size="sm" leftIcon="Upload" onClick={() => coverRef.current?.click()} loading={isPending}>
                Upload Cover
              </Button>
              <Button color="primary" variant="outline" size="sm" leftIcon="Sparkles">
                Generate AI
              </Button>
            </div>
          </div>
          <input ref={coverRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
        </div>
      </div>

      {/* ── Gallery Slots ── */}
      {Array.from({ length: gs.count }).map((_, i) => (
        <GallerySlot
          key={i}
          index={i}
          image={gallery[i] ?? null}
          isMarketing={gs.marketingAssets.length > 0}
          onUpload={(file) => handleSlotUpload(i, file)}
          onRemove={() => handleSlotRemove(i)}
          onAltChange={(alt) => handleAltChange(i, alt)}
        />
      ))}
    </div>
  );
}

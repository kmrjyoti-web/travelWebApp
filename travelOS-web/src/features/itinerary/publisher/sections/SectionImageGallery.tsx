'use client';
import React, { useRef, useState } from 'react';
import { Button, TextField } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import { useUploadImage } from '../hooks/usePublish';
import type { PackageImage, MarketingAssetSize } from '../types/publish.types';

const MARKETING_ASSETS: { id: MarketingAssetSize; label: string }[] = [
  { id: 'vertical_feature',    label: 'Vertical Feature'   },
  { id: 'standard_landscape',  label: 'Standard Landscape' },
  { id: 'large_feature',       label: 'Large Feature'      },
  { id: 'portrait',            label: 'Portrait'           },
  { id: 'panoramic_banner',    label: 'Panoramic Banner'   },
];

/* ── Lightbox ──────────────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 18, right: 22, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', fontSize: 20, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon name="X" size={18} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src} alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 10, objectFit: 'contain', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
      />
    </div>
  );
}

/* ── Image Card ────────────────────────────────────────────────── */
function ImageCard({
  index, image, onUpload, onRemove, onNameChange, onSetCover, onPreview,
}: {
  index: number;
  image: PackageImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onNameChange: (name: string) => void;
  onSetCover: () => void;
  onPreview: (src: string, alt: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
      {/* Thumbnail */}
      <div
        style={{ position: 'relative', aspectRatio: '16/9', background: '#f3f4f6', cursor: image ? 'zoom-in' : 'pointer', overflow: 'hidden' }}
        onClick={() => image ? onPreview(image.url, image.caption) : fileRef.current?.click()}
      >
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {image.isPrimary && (
              <span style={{ position: 'absolute', top: 5, left: 5, background: '#4f46e5', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '2px 7px', borderRadius: 10, letterSpacing: '0.05em' }}>
                COVER
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="X" size={10} />
            </button>
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon name="ImagePlus" size={22} style={{ color: '#d1d5db' }} />
            <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Click to Upload</span>
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />

      {/* Card footer */}
      <div style={{ padding: '7px 8px 8px' }}>
        <TextField
          label="Image Name"
          variant="outlined"
          size="xs"
          value={image?.caption ?? `Image ${index + 1}`}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => fileRef.current?.click()} title="Upload image" style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              <Icon name="Upload" size={11} />
            </button>
            <button title="Generate AI image" style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #c4b5fd', background: '#f5f3ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <Icon name="Sparkles" size={11} />
            </button>
          </div>
          {image && !image.isPrimary && (
            <button
              onClick={onSetCover}
              title="Set as cover image"
              style={{ fontSize: '0.58rem', fontWeight: 700, color: '#4f46e5', background: 'none', border: '1px solid #c4b5fd', borderRadius: 6, padding: '2px 6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Set Cover
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ───────────────────────────────────────────────── */
export function SectionImageGallery() {
  const gallery      = usePublishStore((s) => s.data.gallery);
  const gs           = usePublishStore((s) => s.data.gallerySettings);
  const genInfo      = usePublishStore((s) => s.data.generalInfo);
  const update       = usePublishStore((s) => s.updateSection);
  const { mutateAsync: upload } = useUploadImage();
  const [preview, setPreview]   = useState<{ src: string; alt: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);

  const setGs = (p: Partial<typeof gs>) => update('gallerySettings', { ...gs, ...p });

  const handleCoverUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await upload(file);
      update('generalInfo', { ...genInfo, coverImageUrl: res.data.url });
    } finally {
      setUploading(false);
    }
  };

  const toggleAsset = (id: MarketingAssetSize) => {
    const next = gs.marketingAssets.includes(id)
      ? gs.marketingAssets.filter((x) => x !== id)
      : [...gs.marketingAssets, id];
    setGs({ marketingAssets: next });
  };

  const handleUpload = async (slotIdx: number, file: File) => {
    const res = await upload(file);
    const newImg: PackageImage = {
      url: res.data.url,
      caption: `Image ${slotIdx + 1}`,
      isPrimary: gallery.length === 0 && slotIdx === 0,
      altText: `Gallery Image ${slotIdx + 1}`,
    };
    const updated = [...gallery];
    updated[slotIdx] = newImg;
    update('gallery', updated.filter(Boolean));
  };

  const handleRemove = (slotIdx: number) => {
    const updated = gallery.filter((_, i) => i !== slotIdx);
    if (updated.length && !updated.some((x) => x.isPrimary)) updated[0].isPrimary = true;
    update('gallery', updated);
  };

  const handleNameChange = (slotIdx: number, name: string) => {
    const updated = gallery.map((img, i) => i === slotIdx ? { ...img, caption: name, altText: name } : img);
    update('gallery', updated);
  };

  const handleSetCover = (slotIdx: number) => {
    const updated = gallery.map((img, i) => ({ ...img, isPrimary: i === slotIdx }));
    update('gallery', updated);
  };

  return (
    <div>
      {preview && <Lightbox src={preview.src} alt={preview.alt} onClose={() => setPreview(null)} />}

      {/* ── Settings Panel ── */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#111827' }}>Image Gallery Settings</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>Configure and generate AI image prompts. First image is the cover.</p>
          </div>
          <Button color="primary" variant="outline" size="xs" leftIcon="Sparkles">Generate Content (AI)</Button>
        </div>

        {/* Cover Image URL */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>0. Cover Image</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <TextField
                label="Cover Image URL"
                variant="outlined"
                size="xs"
                startIcon="Image"
                value={genInfo.coverImageUrl}
                onChange={(e) => update('generalInfo', { ...genInfo, coverImageUrl: e.target.value })}
              />
            </div>
            <Button
              color="secondary"
              variant="outline"
              size="sm"
              leftIcon="Upload"
              onClick={() => coverFileRef.current?.click()}
              loading={uploading}
              style={{ flexShrink: 0, height: '38px' }}
            >
              Upload
            </Button>
            <input
              ref={coverFileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }}
            />
          </div>
          {genInfo.coverImageUrl && (
            <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={genInfo.coverImageUrl}
                alt="cover preview"
                onClick={() => setPreview({ src: genInfo.coverImageUrl, alt: 'Cover Image' })}
                style={{ height: 80, width: 'auto', maxWidth: '100%', borderRadius: 6, objectFit: 'cover', display: 'block', cursor: 'zoom-in', border: '2px solid #4f46e5' }}
              />
              <span style={{ position: 'absolute', top: 4, left: 4, background: '#4f46e5', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>
                COVER
              </span>
            </div>
          )}
        </div>

        {/* Count + Marketing side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>1. General Gallery</p>
            <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#6b7280' }}>Number of images (16:9)</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={() => setGs({ count: Math.max(1, gs.count - 1) })} style={{ width: 36, height: 36, borderRadius: '8px 0 0 8px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChevronDown" size={16} />
              </button>
              <div style={{ width: 56, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb', borderLeft: 'none', borderRight: 'none', fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
                {gs.count}
              </div>
              <button onClick={() => setGs({ count: Math.min(20, gs.count + 1) })} style={{ width: 36, height: 36, borderRadius: '0 8px 8px 0', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChevronUp" size={16} />
              </button>
            </div>
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem' }}>
            <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>2. Marketing Assets</p>
            <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#6b7280' }}>Select sizes to generate.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              {MARKETING_ASSETS.map((a) => (
                <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: '0.82rem', color: '#374151' }}>
                  <div onClick={() => toggleAsset(a.id)} style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `2px solid ${gs.marketingAssets.includes(a.id) ? '#4f46e5' : '#d1d5db'}`, background: gs.marketingAssets.includes(a.id) ? '#4f46e5' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {gs.marketingAssets.includes(a.id) && <Icon name="Check" size={10} style={{ color: '#fff' }} />}
                  </div>
                  {a.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Grid: 4 per row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {Array.from({ length: gs.count }).map((_, i) => (
          <ImageCard
            key={i}
            index={i}
            image={gallery[i] ?? null}
            onUpload={(file) => handleUpload(i, file)}
            onRemove={() => handleRemove(i)}
            onNameChange={(name) => handleNameChange(i, name)}
            onSetCover={() => handleSetCover(i)}
            onPreview={(src, alt) => setPreview({ src, alt })}
          />
        ))}
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { TextField, SelectField, Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { FullItineraryFormData } from '../../types/editor.types';
import { IMAGE_TYPES } from '../../types/editor.types';

export function StepImages() {
  const { register, control, watch, formState: { errors } } = useFormContext<FullItineraryFormData>();
  const days = watch('days') ?? 1;

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });

  function addImage() {
    append({ url: '', caption: '', day: null, type: 'gallery' as const });
  }

  return (
    <div className="tos-editor-step">
      <div className="tos-step-toolbar">
        <span className="tos-step-toolbar__info">
          <Icon name="Image" size={15} /> {fields.length} image{fields.length !== 1 ? 's' : ''}
        </span>
        <Button type="button" color="primary" size="sm" onClick={addImage}>
          <Icon name="Plus" size={14} /> Add Image
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="tos-empty-state">
          <Icon name="Image" size={32} />
          <p>Add image URLs for your itinerary — cover photo, hotel photos, activity shots.</p>
          <Button type="button" color="secondary" size="sm" onClick={addImage}>+ Add Image</Button>
        </div>
      )}

      <div className="tos-image-grid">
        {fields.map((field, idx) => {
          const url = watch(`images.${idx}.url`);
          return (
            <div key={field.id} className="tos-image-card">
              {url && (
                <div className="tos-image-card__preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="preview" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div className="tos-image-card__fields">
                <TextField startIcon="Link" label="Image URL *" size="xs"
                  {...register(`images.${idx}.url`)}
                  error={!!errors.images?.[idx]?.url} helperText={errors.images?.[idx]?.url?.message} />
                <TextField startIcon="FileText" label="Caption" size="xs"
                  {...register(`images.${idx}.caption`)} />
                <div className="tos-form-grid">
                  <Controller name={`images.${idx}.type`} control={control}
                    render={({ field: f }) => (
                      <SelectField label="Type" size="xs" value={f.value} onChange={f.onChange}>
                        {IMAGE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </SelectField>
                    )} />
                  <TextField startIcon="Hash" label={`Day (1–${days}, optional)`} type="number" size="xs"
                    {...register(`images.${idx}.day`, { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })} />
                </div>
              </div>
              <button type="button" className="tos-image-card__remove tos-icon-btn tos-icon-btn--danger"
                onClick={() => remove(idx)} aria-label="Remove image">
                <Icon name="X" size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

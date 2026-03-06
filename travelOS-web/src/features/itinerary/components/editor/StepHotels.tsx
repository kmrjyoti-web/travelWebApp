'use client';
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input, Select, Textarea, Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { FullItineraryFormData } from '../../types/editor.types';

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Superior', 'Executive', 'Family', 'Twin', 'Single'];

export function StepHotels() {
  const { register, control, watch, formState: { errors } } = useFormContext<FullItineraryFormData>();
  const days = watch('days') ?? 1;

  const { fields, append, remove } = useFieldArray({ control, name: 'hotels' });

  function addHotel() {
    const nights = fields.length;
    append({
      night: nights + 1,
      name: '', checkIn: '', checkOut: '',
      roomType: 'Standard', starRating: 3,
      address: '', pricePerNight: null, notes: '',
    });
  }

  return (
    <div className="tos-editor-step">
      <div className="tos-step-toolbar">
        <span className="tos-step-toolbar__info">
          <Icon name="Building2" size={15} /> {fields.length} hotel{fields.length !== 1 ? 's' : ''} • {days} night{days !== 1 ? 's' : ''}
        </span>
        <Button type="button" color="primary" size="sm" onClick={addHotel}>
          <Icon name="Plus" size={14} /> Add Hotel
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="tos-empty-state">
          <Icon name="Building2" size={32} />
          <p>Add hotel stays for each night of your trip.</p>
          <Button type="button" color="secondary" size="sm" onClick={addHotel}>+ Add Hotel</Button>
        </div>
      )}

      {fields.map((field, idx) => (
        <div key={field.id} className="tos-card">
          <div className="tos-card__header">
            <span className="tos-day-card__badge">Night {idx + 1}</span>
            <button type="button" className="tos-icon-btn tos-icon-btn--danger"
              onClick={() => remove(idx)} aria-label="Remove hotel">
              <Icon name="Trash2" size={14} />
            </button>
          </div>

          <div className="tos-form-grid">
            <div className="tos-form-grid__span2">
              <Input icon="Building2" floatingLabel="Hotel Name *"
                {...register(`hotels.${idx}.name`)}
                errorMessage={errors.hotels?.[idx]?.name?.message} />
            </div>
            <Input icon="MapPin" floatingLabel="Address"
              {...register(`hotels.${idx}.address`)} />
            <div className="tos-star-row">
              <label className="tos-stepper__label">Star Rating</label>
              <div className="tos-star-buttons">
                {[1,2,3,4,5].map(s => (
                  <StarBtn key={s} star={s} name={`hotels.${idx}.starRating`} control={control} register={register} />
                ))}
              </div>
            </div>
            <Input icon="Calendar" floatingLabel="Check-In Date" type="date"
              {...register(`hotels.${idx}.checkIn`)} />
            <Input icon="Calendar" floatingLabel="Check-Out Date" type="date"
              {...register(`hotels.${idx}.checkOut`)} />
            <Select icon="BedDouble" floatingLabel="Room Type"
              {...register(`hotels.${idx}.roomType`)}>
              {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
            <Input icon="DollarSign" floatingLabel="Price / Night (optional)" type="number"
              {...register(`hotels.${idx}.pricePerNight`, { valueAsNumber: true })} />
            <div className="tos-form-grid__span2">
              <Textarea icon="FileText" floatingLabel="Notes / Amenities"
                {...register(`hotels.${idx}.notes`)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StarBtn({ star, name, register }: { star: number; name: string; control: any; register: any }) {
  return (
    <label className="tos-star-label">
      <input type="radio" value={star} {...register(name, { valueAsNumber: true })}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <Icon name="Star" size={18} />
    </label>
  );
}

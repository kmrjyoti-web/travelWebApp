'use client';
import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { TextField, SelectField, TextareaField, Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import type { FullItineraryFormData } from '../../types/editor.types';
import { TRANSPORT_TYPES } from '../../types/editor.types';

const TRANSPORT_ICONS: Record<string, string> = {
  flight: 'Plane', train: 'TrainFront', bus: 'Bus',
  car: 'Car', taxi: 'Car', ferry: 'Ship', other: 'Navigation',
};

export function StepTransport() {
  const { register, control, watch, formState: { errors } } = useFormContext<FullItineraryFormData>();
  const days = watch('days') ?? 1;

  const { fields, append, remove } = useFieldArray({ control, name: 'transportation' });

  function addTransport() {
    append({
      day: 1, type: 'flight' as const, from: '', to: '',
      departureTime: '', arrivalTime: '',
      provider: '', bookingRef: '', cost: null, notes: '',
    });
  }

  return (
    <div className="tos-editor-step">
      <div className="tos-step-toolbar">
        <span className="tos-step-toolbar__info">
          <Icon name="Plane" size={15} /> {fields.length} transport leg{fields.length !== 1 ? 's' : ''}
        </span>
        <Button type="button" color="primary" size="sm" onClick={addTransport}>
          <Icon name="Plus" size={14} /> Add Transport
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="tos-empty-state">
          <Icon name="Plane" size={32} />
          <p>Add flights, trains, transfers and other transport legs.</p>
          <Button type="button" color="secondary" size="sm" onClick={addTransport}>+ Add Transport</Button>
        </div>
      )}

      {fields.map((field, idx) => {
        const type = watch(`transportation.${idx}.type`) ?? 'flight';
        return (
          <div key={field.id} className="tos-card">
            <div className="tos-card__header">
              <span className="tos-day-card__badge">
                <Icon name={(TRANSPORT_ICONS[type] ?? 'Navigation') as IconName} size={13} />
                {String(type).charAt(0).toUpperCase() + String(type).slice(1)} #{idx + 1}
              </span>
              <button type="button" className="tos-icon-btn tos-icon-btn--danger"
                onClick={() => remove(idx)} aria-label="Remove transport">
                <Icon name="Trash2" size={14} />
              </button>
            </div>

            <div className="tos-form-grid">
              <Controller name={`transportation.${idx}.type`} control={control}
                render={({ field: f }) => (
                  <SelectField label="Type" size="xs" value={f.value} onChange={f.onChange}>
                    {TRANSPORT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </SelectField>
                )} />
              <TextField startIcon="Hash" label={`Day (1–${days})`} type="number" size="xs"
                {...register(`transportation.${idx}.day`, { valueAsNumber: true })} />
              <TextField startIcon="MapPin" label="From" size="xs"
                {...register(`transportation.${idx}.from`)} />
              <TextField startIcon="MapPin" label="To" size="xs"
                {...register(`transportation.${idx}.to`)} />
              <TextField startIcon="Clock" label="Departure Time" type="time" size="xs"
                {...register(`transportation.${idx}.departureTime`)} />
              <TextField startIcon="Clock" label="Arrival Time" type="time" size="xs"
                {...register(`transportation.${idx}.arrivalTime`)} />
              <TextField startIcon="Building" label="Provider / Airline" size="xs"
                {...register(`transportation.${idx}.provider`)} />
              <TextField startIcon="Hash" label="Booking Reference" size="xs"
                {...register(`transportation.${idx}.bookingRef`)} />
              <TextField startIcon="DollarSign" label="Cost (optional)" type="number" size="xs"
                {...register(`transportation.${idx}.cost`, { valueAsNumber: true })} />
              <div className="tos-form-grid__span3">
                <TextareaField label="Notes" size="sm"
                  {...register(`transportation.${idx}.notes`)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

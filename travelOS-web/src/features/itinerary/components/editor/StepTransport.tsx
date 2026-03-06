'use client';
import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input, Select, Textarea, Button } from '@/shared/components';
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
                  <Select icon="Navigation" floatingLabel="Type" value={f.value} onChange={f.onChange}>
                    {TRANSPORT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </Select>
                )} />
              <Input icon="Hash" floatingLabel={`Day (1–${days})`} type="number"
                {...register(`transportation.${idx}.day`, { valueAsNumber: true })} />
              <Input icon="MapPin" floatingLabel="From"
                {...register(`transportation.${idx}.from`)} />
              <Input icon="MapPin" floatingLabel="To"
                {...register(`transportation.${idx}.to`)} />
              <Input icon="Clock" floatingLabel="Departure Time" type="time"
                {...register(`transportation.${idx}.departureTime`)} />
              <Input icon="Clock" floatingLabel="Arrival Time" type="time"
                {...register(`transportation.${idx}.arrivalTime`)} />
              <Input icon="Building" floatingLabel="Provider / Airline"
                {...register(`transportation.${idx}.provider`)} />
              <Input icon="Hash" floatingLabel="Booking Reference"
                {...register(`transportation.${idx}.bookingRef`)} />
              <Input icon="DollarSign" floatingLabel="Cost (optional)" type="number"
                {...register(`transportation.${idx}.cost`, { valueAsNumber: true })} />
              <div className="tos-form-grid__span3">
                <Textarea icon="FileText" floatingLabel="Notes"
                  {...register(`transportation.${idx}.notes`)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

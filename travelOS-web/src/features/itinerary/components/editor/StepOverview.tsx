'use client';
import React, { useEffect } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { TextField, SelectField, TextareaField, Checkbox } from '@/shared/components';
import { CitySearch } from '@/shared/components';
import { useCurrencies } from '@/shared/hooks';
import { NumberStepper } from '../NumberStepper';
import type { FullItineraryFormData } from '../../types/editor.types';
import {
  BUDGET_OPTIONS, ACCOMMODATION_OPTIONS, STAR_RATING_OPTIONS,
  FOOD_OPTIONS, TRIP_NATURE_OPTIONS, SERVICE_OPTIONS, CURRENCY_OPTIONS,
  TIME_PREF_OPTIONS, TRAIN_PREF_OPTIONS,
} from '../../types/itinerary.types';

export function StepOverview() {
  const { register, control, setValue, formState: { errors } } = useFormContext<FullItineraryFormData>();
  const startDate = useWatch({ control, name: 'startDate' });
  const endDate   = useWatch({ control, name: 'endDate' });

  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate), e = new Date(endDate);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s) {
        setValue('days', Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1, { shouldValidate: true });
      } else { setValue('days', 0); }
    } else { setValue('days', 0); }
  }, [startDate, endDate, setValue]);

  const { data: apiCurrencies, isLoading: currLoad } = useCurrencies();
  const currencyOpts = apiCurrencies
    ? apiCurrencies.map((c) => ({ value: c.code, label: `${c.code} — ${c.name}` }))
    : CURRENCY_OPTIONS.map((c) => ({ value: c, label: c }));

  return (
    <div className="tos-editor-step">
      {/* Trip identity */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">Trip Identity</h6>
        <div className="tos-form-grid tos-form-grid--full">
          <TextField startIcon="Tag" label="Trip Title (optional)" {...register('title')} size="xs" />
        </div>
        <div className="tos-form-grid">
          <Controller name="from" control={control} render={({ field }) => (
            <CitySearch value={field.value} onChange={field.onChange} onBlur={field.onBlur}
              icon="MapPin" floatingLabel="From (Origin)" errorMessage={errors.from?.message} />
          )} />
          <Controller name="to" control={control} render={({ field }) => (
            <CitySearch value={field.value} onChange={field.onChange} onBlur={field.onBlur}
              icon="MapPin" floatingLabel="To (Destination)" errorMessage={errors.to?.message} />
          )} />
          <TextField startIcon="Calendar" label="Start Date" type="date" {...register('startDate')} error={!!errors.startDate} helperText={errors.startDate?.message} size="xs" />
          <TextField startIcon="Calendar" label="End Date" type="date" {...register('endDate')} error={!!errors.endDate} helperText={errors.endDate?.message} size="xs" />
          <Controller name="days" control={control} render={({ field }) => (
            <TextField startIcon="Clock" label="Days" type="number" value={field.value || ''} readOnly error={!!errors.days} helperText={errors.days?.message} size="xs" />
          )} />
          <div />
          <Controller name="adults"   control={control} render={({ field }) => (
            <NumberStepper icon="Users" label="Adults"   value={field.value} onChange={field.onChange} min={1} max={20} />
          )} />
          <Controller name="children" control={control} render={({ field }) => (
            <NumberStepper icon="Baby"  label="Children" value={field.value} onChange={field.onChange} min={0} max={10} />
          )} />
        </div>
      </div>

      {/* Preferences */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">Travel Preferences</h6>
        <div className="tos-form-grid">
          <SelectField label="Budget" {...register('budget')} size="xs">
            {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </SelectField>
          <SelectField label="Currency" {...register('currency')} disabled={currLoad} size="xs">
            {currLoad && <option value="">Loading…</option>}
            {currencyOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </SelectField>
          <SelectField label="Accommodation" {...register('accommodationType')} size="xs">
            {ACCOMMODATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </SelectField>
          <SelectField label="Star Rating" {...register('starRating')} size="xs">
            {STAR_RATING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </SelectField>
          <SelectField label="Food Preference" {...register('food')} size="xs">
            {FOOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </SelectField>
          <SelectField label="Trip Nature" {...register('tripNature')} size="xs">
            {TRIP_NATURE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </SelectField>

          <div className="tos-form-grid__full">
            <div className="tos-icon-field">
              <span className="tos-icon-field__icon" aria-hidden />
              <div className="tos-icon-field__input">
                <label className="tos-stepper__label">Services</label>
                <Controller name="services" control={control} render={({ field }) => (
                  <div className="tos-services-grid">
                    {SERVICE_OPTIONS.map(svc => (
                      <Checkbox key={svc} label={svc}
                        checked={field.value.includes(svc)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const next = e.target.checked ? [...field.value, svc] : field.value.filter((s: string) => s !== svc);
                          field.onChange(next);
                        }} />
                    ))}
                  </div>
                )} />
              </div>
            </div>
          </div>

          <div className="tos-form-grid__full">
            <TextareaField label="Interests & Preferences" {...register('interests')} error={!!errors.interests} helperText={errors.interests?.message} size="sm" />
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">Transport Preferences</h6>
        <div className="tos-form-grid tos-form-grid--3col">
          <SelectField label="Flight Departure" {...register('flightDepartureTime')} size="xs">
            {TIME_PREF_OPTIONS.map(o => <option key={o} value={o}>{o === 'any' ? 'Any Time' : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </SelectField>
          <SelectField label="Flight Arrival" {...register('flightArrivalTime')} size="xs">
            {TIME_PREF_OPTIONS.map(o => <option key={o} value={o}>{o === 'any' ? 'Any Time' : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </SelectField>
          <SelectField label="Train Preference" {...register('trainPreference')} size="xs">
            {TRAIN_PREF_OPTIONS.map(o => <option key={o} value={o}>{o === 'any' ? 'Any' : o.toUpperCase()}</option>)}
          </SelectField>
        </div>
      </div>
    </div>
  );
}

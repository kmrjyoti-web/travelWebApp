'use client';
import React, { useEffect } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { Input, Select, Textarea, Checkbox } from '@/shared/components';
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
          <Input icon="Tag" floatingLabel="Trip Title (optional)" {...register('title')} />
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
          <Input icon="Calendar" floatingLabel="Start Date" type="date" {...register('startDate')} errorMessage={errors.startDate?.message} />
          <Input icon="Calendar" floatingLabel="End Date"   type="date" {...register('endDate')}   errorMessage={errors.endDate?.message} />
          <Controller name="days" control={control} render={({ field }) => (
            <Input icon="Clock" floatingLabel="Days" type="number" value={field.value || ''} readOnly errorMessage={errors.days?.message} />
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
          <Select icon="Wallet" floatingLabel="Budget" {...register('budget')}>
            {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select icon="DollarSign" floatingLabel="Currency" {...register('currency')} disabled={currLoad}>
            {currLoad && <option value="">Loading…</option>}
            {currencyOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
          <Select icon="Building" floatingLabel="Accommodation" {...register('accommodationType')}>
            {ACCOMMODATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select icon="Star" floatingLabel="Star Rating" {...register('starRating')}>
            {STAR_RATING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select icon="UtensilsCrossed" floatingLabel="Food Preference" {...register('food')}>
            {FOOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select icon="Compass" floatingLabel="Trip Nature" {...register('tripNature')}>
            {TRIP_NATURE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>

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
            <Textarea icon="MessageSquare" floatingLabel="Interests & Preferences" {...register('interests')} errorMessage={errors.interests?.message} />
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">Transport Preferences</h6>
        <div className="tos-form-grid tos-form-grid--3col">
          <Select icon="PlaneTakeoff" floatingLabel="Flight Departure" {...register('flightDepartureTime')}>
            {TIME_PREF_OPTIONS.map(o => <option key={o} value={o}>{o === 'any' ? 'Any Time' : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </Select>
          <Select icon="PlaneLanding" floatingLabel="Flight Arrival" {...register('flightArrivalTime')}>
            {TIME_PREF_OPTIONS.map(o => <option key={o} value={o}>{o === 'any' ? 'Any Time' : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </Select>
          <Select icon="TrainFront" floatingLabel="Train Preference" {...register('trainPreference')}>
            {TRAIN_PREF_OPTIONS.map(o => <option key={o} value={o}>{o === 'any' ? 'Any' : o.toUpperCase()}</option>)}
          </Select>
        </div>
      </div>
    </div>
  );
}

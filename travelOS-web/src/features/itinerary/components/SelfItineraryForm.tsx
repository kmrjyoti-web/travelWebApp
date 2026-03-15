'use client';
import React, { useEffect } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, SelectField, TextareaField, Checkbox, Button, Icon, CitySearch } from '@/shared/components';
import { useCurrencies } from '@/shared/hooks';
import { useCreateItinerary } from '@/shared/hooks/useItinerary';
import { NumberStepper } from './NumberStepper';
import {
  selfItinerarySchema,
  SELF_ITINERARY_DEFAULTS,
  BUDGET_OPTIONS,
  ACCOMMODATION_OPTIONS,
  STAR_RATING_OPTIONS,
  FOOD_OPTIONS,
  SERVICE_OPTIONS,
  CURRENCY_OPTIONS,
  TRIP_NATURE_OPTIONS,
  TIME_PREF_OPTIONS,
  TRAIN_PREF_OPTIONS,
} from '../types/itinerary.types';
import type { SelfItineraryFormData } from '../types/itinerary.types';
import './self-itinerary.css';

interface SelfItineraryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function SelfItineraryForm({ onSuccess, onCancel }: SelfItineraryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SelfItineraryFormData>({
    resolver: zodResolver(selfItinerarySchema),
    defaultValues: SELF_ITINERARY_DEFAULTS,
    mode: 'onBlur',
  });

  const startDate = useWatch({ control, name: 'startDate' });
  const endDate = useWatch({ control, name: 'endDate' });

  // Currencies from API — fallback to static list while loading / on error
  const { data: apiCurrencies, isLoading: currenciesLoading } = useCurrencies();
  const currencyOptions = apiCurrencies
    ? apiCurrencies.map((c) => ({ value: c.code, label: `${c.code} — ${c.name} (${c.symbol})` }))
    : CURRENCY_OPTIONS.map((c) => ({ value: c, label: c }));

  const createItinerary = useCreateItinerary();

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setValue('days', diffDays, { shouldValidate: true });
      } else {
        setValue('days', 0);
      }
    } else {
      setValue('days', 0);
    }
  }, [startDate, endDate, setValue]);

  const onSubmit = async (data: SelfItineraryFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createItinerary.mutateAsync(data as any);
      onSuccess();
    } catch {
      // Error is surfaced via createItinerary.error — no additional action needed
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Section 1: Trip Details */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">
          <Icon name="Map" size={14} /> Trip Details
        </h6>
        <div className="tos-form-grid">
          <Controller
            name="from"
            control={control}
            render={({ field }) => (
              <CitySearch
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                icon="MapPin"
                floatingLabel="From (Origin City)"
                errorMessage={errors.from?.message}
              />
            )}
          />
          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <CitySearch
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                icon="MapPin"
                floatingLabel="To (Destination)"
                errorMessage={errors.to?.message}
              />
            )}
          />
          <TextField
            startIcon="Calendar"
            label="Start Date"
            type="date"
            {...register('startDate')}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            size="xs"
          />
          <TextField
            startIcon="Calendar"
            label="End Date"
            type="date"
            {...register('endDate')}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
            size="xs"
          />
          <Controller
            name="days"
            control={control}
            render={({ field }) => (
              <TextField
                startIcon="Clock"
                label="Days"
                type="number"
                value={field.value || ''}
                readOnly
                error={!!errors.days}
                helperText={errors.days?.message}
                size="xs"
              />
            )}
          />
          <div /> {/* empty cell for grid alignment */}
          <Controller
            name="adults"
            control={control}
            render={({ field }) => (
              <NumberStepper
                icon="Users"
                label="Adults"
                value={field.value}
                onChange={field.onChange}
                min={1}
                max={20}
              />
            )}
          />
          <Controller
            name="children"
            control={control}
            render={({ field }) => (
              <NumberStepper
                icon="Baby"
                label="Children"
                value={field.value}
                onChange={field.onChange}
                min={0}
                max={10}
              />
            )}
          />
        </div>
      </div>

      {/* Section 2: Travel Preferences */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">
          <Icon name="Compass" size={14} /> Travel Preferences
        </h6>
        <div className="tos-form-grid">
          <SelectField
            label="Budget"
            {...register('budget')}
            error={!!errors.budget}
            helperText={errors.budget?.message}
            size="xs"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </SelectField>
          <SelectField
            label="Currency"
            {...register('currency')}
            error={!!errors.currency}
            helperText={errors.currency?.message}
            disabled={currenciesLoading}
            size="xs"
          >
            {currenciesLoading && <option value="">Loading currencies…</option>}
            {currencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SelectField>
          <SelectField
            label="Accommodation"
            {...register('accommodationType')}
            error={!!errors.accommodationType}
            helperText={errors.accommodationType?.message}
            size="xs"
          >
            {ACCOMMODATION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </SelectField>
          <SelectField
            label="Star Rating"
            {...register('starRating')}
            error={!!errors.starRating}
            helperText={errors.starRating?.message}
            size="xs"
          >
            {STAR_RATING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </SelectField>
          <SelectField
            label="Food Preference"
            {...register('food')}
            error={!!errors.food}
            helperText={errors.food?.message}
            size="xs"
          >
            {FOOD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </SelectField>
          <SelectField
            label="Trip Nature"
            {...register('tripNature')}
            error={!!errors.tripNature}
            helperText={errors.tripNature?.message}
            size="xs"
          >
            {TRIP_NATURE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </SelectField>

          {/* Services multi-select */}
          <div className="tos-form-grid__full">
            <div className="tos-icon-field">
              <span className="tos-icon-field__icon" aria-hidden="true">
                <Icon name="Briefcase" size={16} />
              </span>
              <div className="tos-icon-field__input">
                <label className="tos-stepper__label">Services</label>
                <Controller
                  name="services"
                  control={control}
                  render={({ field }) => (
                    <div className="tos-services-grid">
                      {SERVICE_OPTIONS.map((svc) => (
                        <Checkbox
                          key={svc}
                          label={svc}
                          checked={field.value.includes(svc)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked;
                            const next = checked
                              ? [...field.value, svc]
                              : field.value.filter((s: string) => s !== svc);
                            field.onChange(next);
                          }}
                        />
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="tos-form-grid__full">
            <TextareaField
              label="Interests & Preferences"
              {...register('interests')}
              error={!!errors.interests}
              helperText={errors.interests?.message}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Transport Preferences */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">
          <Icon name="Plane" size={14} /> Transport Preferences
        </h6>
        <div className="tos-form-grid tos-form-grid--3col">
          <SelectField
            label="Flight Departure"
            {...register('flightDepartureTime')}
            size="xs"
          >
            {TIME_PREF_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt === 'any' ? 'Any Time' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </SelectField>
          <SelectField
            label="Flight Arrival"
            {...register('flightArrivalTime')}
            size="xs"
          >
            {TIME_PREF_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt === 'any' ? 'Any Time' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </SelectField>
          <SelectField
            label="Train Preference"
            {...register('trainPreference')}
            size="xs"
          >
            {TRAIN_PREF_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt === 'any' ? 'Any' : opt.toUpperCase()}</option>
            ))}
          </SelectField>
        </div>
      </div>

      {/* API error */}
      {createItinerary.isError && (
        <p className="tos-form-error" role="alert">
          <Icon name="CircleAlert" size={14} aria-hidden />
          {(createItinerary.error as { message?: string })?.message ?? 'Failed to create itinerary. Please try again.'}
        </p>
      )}

      {/* Footer */}
      <div className="tos-form-footer">
        <Button type="button" color="secondary" variant="outline" onClick={onCancel} disabled={createItinerary.isPending}>
          Cancel
        </Button>
        <Button type="submit" color="primary" disabled={createItinerary.isPending}>
          {createItinerary.isPending ? 'Creating...' : 'Create Itinerary'}
        </Button>
      </div>
    </form>
  );
}

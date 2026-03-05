'use client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, Textarea, Button, Icon } from '@/shared/components';
import { NumberStepper } from './NumberStepper';
import {
  aiItinerarySchema,
  AI_ITINERARY_DEFAULTS,
  BUDGET_OPTIONS,
  AI_MODEL_OPTIONS,
} from '../types/itinerary.types';
import type { AiItineraryFormData } from '../types/itinerary.types';
import './self-itinerary.css';

interface AiItineraryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AiItineraryForm({ onSuccess, onCancel }: AiItineraryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AiItineraryFormData>({
    resolver: zodResolver(aiItinerarySchema),
    defaultValues: AI_ITINERARY_DEFAULTS,
    mode: 'onBlur',
  });

  const onSubmit = (data: AiItineraryFormData) => {
    console.log('AI Itinerary:', data);
    // TODO: call API to generate AI itinerary, then handle response
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* AI Prompt */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">
          <Icon name="Sparkles" size={14} /> Describe Your Trip
        </h6>
        <Textarea
          icon="MessageSquare"
          floatingLabel="e.g., A 7-day romantic honeymoon in Bali focusing on beaches and culture..."
          rows={4}
          {...register('prompt')}
          errorMessage={errors.prompt?.message}
        />
      </div>

      {/* Basic Trip Details */}
      <div className="tos-form-section">
        <h6 className="tos-form-section__title">
          <Icon name="Map" size={14} /> Trip Details
        </h6>
        <div className="tos-form-grid">
          <Input
            icon="MapPin"
            floatingLabel="From (Origin City)"
            {...register('from')}
            errorMessage={errors.from?.message}
          />
          <Input
            icon="MapPin"
            floatingLabel="To (Destination)"
            {...register('to')}
            errorMessage={errors.to?.message}
          />
          <Input
            icon="Calendar"
            floatingLabel="Start Date"
            type="date"
            {...register('startDate')}
            errorMessage={errors.startDate?.message}
          />
          <Input
            icon="Calendar"
            floatingLabel="End Date"
            type="date"
            {...register('endDate')}
            errorMessage={errors.endDate?.message}
          />
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
          <Select
            icon="Wallet"
            floatingLabel="Budget"
            {...register('budget')}
            errorMessage={errors.budget?.message}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
          <Select
            icon="Bot"
            floatingLabel="AI Model"
            {...register('selectedModel')}
            errorMessage={errors.selectedModel?.message}
          >
            {AI_MODEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Footer */}
      <div className="tos-form-footer">
        <Button type="button" color="secondary" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Generate Itinerary'}
        </Button>
      </div>
    </form>
  );
}

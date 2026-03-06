'use client';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import { useCreateItinerary, useUpdateItinerary } from '@/shared/hooks/useItinerary';
import { fullItinerarySchema, FULL_ITINERARY_DEFAULTS, EDITOR_STEPS } from '../types/editor.types';
import type { FullItineraryFormData, EditorStepId, EditorMode } from '../types/editor.types';
import { StepOverview }   from './editor/StepOverview';
import { StepDayByDay }   from './editor/StepDayByDay';
import { StepHotels }     from './editor/StepHotels';
import { StepTransport }  from './editor/StepTransport';
import { StepImages }     from './editor/StepImages';
import './editor/editor.css';

interface ItineraryEditorFormProps {
  mode: EditorMode;
  editId?: string;
  initialData?: Partial<FullItineraryFormData>;
  onSuccess: () => void;
  onCancel: () => void;
}

const SOURCE_LABEL: Record<EditorMode, string> = {
  manual: 'Manual',
  ai:     'AI Generated',
  edit:   'Editing',
};

const SOURCE_ICON: Record<EditorMode, IconName> = {
  manual: 'PenLine',
  ai:     'Sparkles',
  edit:   'Pencil',
};

export function ItineraryEditorForm({ mode, editId, initialData, onSuccess, onCancel }: ItineraryEditorFormProps) {
  const [activeStep, setActiveStep] = useState<EditorStepId>('overview');

  const methods = useForm<FullItineraryFormData>({
    resolver: zodResolver(fullItinerarySchema),
    defaultValues: { ...FULL_ITINERARY_DEFAULTS, source: mode, ...initialData },
    mode: 'onBlur',
  });

  const { formState: { errors }, watch } = methods;
  const itineraryDays  = watch('itineraryDays');
  const hotels         = watch('hotels');
  const transportation = watch('transportation');
  const images         = watch('images');

  const createMutation = useCreateItinerary();
  const updateMutation = useUpdateItinerary(editId ?? '');
  const mutation = editId ? updateMutation : createMutation;

  const onSubmit = async (data: FullItineraryFormData) => {
    try {
      await mutation.mutateAsync(data);
      onSuccess();
    } catch {
      // error shown via mutation.isError below
    }
  };

  const stepBadge = (id: EditorStepId) => {
    if (id === 'days')      return itineraryDays.length  || undefined;
    if (id === 'hotels')    return hotels.length          || undefined;
    if (id === 'transport') return transportation.length  || undefined;
    if (id === 'images')    return images.length          || undefined;
    return undefined;
  };

  const overviewErrorCount = Object.keys(errors).filter(k =>
    ['from','to','startDate','endDate','days','adults','children'].includes(k)
  ).length;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Source badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className={`tos-editor-source-badge tos-editor-source-badge--${mode}`}>
            <Icon name={SOURCE_ICON[mode]} size={12} />
            {SOURCE_LABEL[mode]}
          </span>
          {editId && <span style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>ID: {editId.slice(0, 8)}…</span>}
        </div>

        {/* Tab navigation */}
        <div className="tos-editor-tabs" role="tablist">
          {EDITOR_STEPS.map(step => {
            const badge = step.id === 'overview' ? (overviewErrorCount > 0 ? overviewErrorCount : undefined) : stepBadge(step.id);
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={activeStep === step.id}
                className={`tos-editor-tab${activeStep === step.id ? ' tos-editor-tab--active' : ''}`}
                onClick={() => setActiveStep(step.id)}
              >
                <Icon name={step.icon} size={14} />
                {step.label}
                {badge !== undefined && <span className="tos-editor-tab__badge">{badge}</span>}
              </button>
            );
          })}
        </div>

        {/* Step content — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 2px' }}>
          {activeStep === 'overview'   && <StepOverview />}
          {activeStep === 'days'       && <StepDayByDay />}
          {activeStep === 'hotels'     && <StepHotels />}
          {activeStep === 'transport'  && <StepTransport />}
          {activeStep === 'images'     && <StepImages />}
        </div>

        {/* Error */}
        {mutation.isError && (
          <p className="tos-form-error" role="alert">
            <Icon name="CircleAlert" size={14} aria-hidden />
            {(mutation.error as { message?: string })?.message ?? 'Failed to save itinerary.'}
          </p>
        )}

        {/* Footer */}
        <div className="tos-form-footer" style={{ borderTop: '1px solid var(--tos-border-color)', paddingTop: 12, marginTop: 8 }}>
          <Button type="button" color="secondary" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </Button>
          <div style={{ display: 'flex', gap: 8 }}>
            {activeStep !== 'overview' && (
              <Button type="button" color="secondary" variant="outline"
                onClick={() => {
                  const idx = EDITOR_STEPS.findIndex(s => s.id === activeStep);
                  if (idx > 0) setActiveStep(EDITOR_STEPS[idx - 1].id);
                }}>
                <Icon name="ChevronLeft" size={14} /> Back
              </Button>
            )}
            {activeStep !== 'images' ? (
              <Button type="button" color="primary"
                onClick={() => {
                  const idx = EDITOR_STEPS.findIndex(s => s.id === activeStep);
                  if (idx < EDITOR_STEPS.length - 1) setActiveStep(EDITOR_STEPS[idx + 1].id);
                }}>
                Next <Icon name="ChevronRight" size={14} />
              </Button>
            ) : (
              <Button type="submit" color="primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : (editId ? 'Update Itinerary' : 'Create Itinerary')}
              </Button>
            )}
            {/* Always visible Save Draft */}
            {activeStep !== 'images' && (
              <Button type="submit" color="secondary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save Draft'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

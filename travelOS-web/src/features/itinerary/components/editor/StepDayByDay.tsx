'use client';
import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { TextField, SelectField, TextareaField, Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { FullItineraryFormData } from '../../types/editor.types';
import { ACTIVITY_TYPES } from '../../types/editor.types';

const EMPTY_ACTIVITY = {
  time: '09:00', title: '', description: '',
  type: 'sightseeing' as const, location: '', duration: '1 hour', cost: null,
};

export function StepDayByDay() {
  const { register, control, watch, formState: { errors } } = useFormContext<FullItineraryFormData>();
  const days = watch('days') ?? 1;
  const startDate = watch('startDate');

  const { fields: dayFields, append: appendDay, remove: removeDay, replace: replaceDays } = useFieldArray({
    control, name: 'itineraryDays',
  });

  function getDayDate(dayNum: number) {
    if (!startDate) return '';
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayNum - 1);
    return d.toISOString().split('T')[0];
  }

  function syncDays() {
    const count = Math.max(1, days);
    const current = dayFields.length;
    if (current === count) return;
    if (count > current) {
      for (let i = current + 1; i <= count; i++) {
        appendDay({ day: i, date: getDayDate(i), title: `Day ${i}`, activities: [] });
      }
    } else {
      replaceDays(dayFields.slice(0, count).map((f, i) => ({ ...f, day: i + 1, date: getDayDate(i + 1) })));
    }
  }

  return (
    <div className="tos-editor-step">
      <div className="tos-step-toolbar">
        <span className="tos-step-toolbar__info">
          <Icon name="CalendarDays" size={15} /> {days} day{days !== 1 ? 's' : ''} • {dayFields.length} configured
        </span>
        <Button type="button" color="primary" size="sm" onClick={syncDays}>
          Auto-generate {days} Day{days !== 1 ? 's' : ''}
        </Button>
      </div>

      {dayFields.length === 0 && (
        <div className="tos-empty-state">
          <div className="tos-empty-state__body">
            <Icon name="CalendarDays" size={32} />
            <p>Click "Auto-generate" to create day-by-day structure, or add days manually.</p>
          </div>
          <Button type="button" color="primary" size="sm"
            onClick={() => appendDay({ day: 1, date: getDayDate(1), title: 'Day 1', activities: [] })}>
            <Icon name="Plus" size={14} /> Add Day
          </Button>
        </div>
      )}

      {dayFields.map((dayField, dayIdx) => (
        <DayCard key={dayField.id} dayIdx={dayIdx} control={control}
          register={register} errors={errors} onRemove={() => removeDay(dayIdx)} />
      ))}

      {dayFields.length > 0 && (
        <Button type="button" color="secondary" variant="outline" size="sm"
          onClick={() => appendDay({ day: dayFields.length + 1, date: getDayDate(dayFields.length + 1), title: `Day ${dayFields.length + 1}`, activities: [] })}>
          <Icon name="Plus" size={14} /> Add Day
        </Button>
      )}
    </div>
  );
}

function DayCard({ dayIdx, control, register, errors, onRemove }: {
  dayIdx: number; control: any; register: any; errors: any; onRemove: () => void;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: `itineraryDays.${dayIdx}.activities` });

  return (
    <div className="tos-day-card">
      <div className="tos-day-card__header">
        <span className="tos-day-card__badge">Day {dayIdx + 1}</span>
        <div className="tos-form-grid" style={{ flex: 1, gap: '8px' }}>
          <TextField startIcon="Calendar" label="Date" type="date" size="xs"
            {...register(`itineraryDays.${dayIdx}.date`)} />
          <TextField startIcon="Tag" label="Day Title" size="xs"
            {...register(`itineraryDays.${dayIdx}.title`)} />
        </div>
        <button type="button" className="tos-icon-btn tos-icon-btn--danger" onClick={onRemove} aria-label="Remove day">
          <Icon name="Trash2" size={14} />
        </button>
      </div>

      <div className="tos-activities">
        {fields.map((act, actIdx) => (
          <div key={act.id} className="tos-activity-row">
            <div className="tos-form-grid tos-form-grid--activity">
              <TextField startIcon="Clock" label="Time" type="time" size="xs"
                {...register(`itineraryDays.${dayIdx}.activities.${actIdx}.time`)} />
              <Controller name={`itineraryDays.${dayIdx}.activities.${actIdx}.type`} control={control}
                render={({ field }) => (
                  <SelectField label="Type" size="xs" value={field.value} onChange={field.onChange}>
                    {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </SelectField>
                )} />
              <div className="tos-form-grid__span2">
                <TextField startIcon="MapPin" label="Activity Title" size="xs"
                  {...register(`itineraryDays.${dayIdx}.activities.${actIdx}.title`)}
                  error={!!errors.itineraryDays?.[dayIdx]?.activities?.[actIdx]?.title} helperText={errors.itineraryDays?.[dayIdx]?.activities?.[actIdx]?.title?.message} />
              </div>
              <TextField startIcon="MapPin" label="Location" size="xs"
                {...register(`itineraryDays.${dayIdx}.activities.${actIdx}.location`)} />
              <TextField startIcon="Clock" label="Duration" size="xs"
                {...register(`itineraryDays.${dayIdx}.activities.${actIdx}.duration`)} />
              <TextField startIcon="DollarSign" label="Cost (optional)" type="number" size="xs"
                {...register(`itineraryDays.${dayIdx}.activities.${actIdx}.cost`, { valueAsNumber: true })} />
              <div className="tos-form-grid__span3">
                <TextareaField label="Notes" size="sm"
                  {...register(`itineraryDays.${dayIdx}.activities.${actIdx}.description`)} />
              </div>
            </div>
            <button type="button" className="tos-icon-btn tos-icon-btn--danger" onClick={() => remove(actIdx)} aria-label="Remove activity">
              <Icon name="X" size={12} />
            </button>
          </div>
        ))}
        <Button type="button" color="secondary" size="sm" variant="ghost"
          onClick={() => append({ ...EMPTY_ACTIVITY })}>
          <Icon name="Plus" size={12} /> Add Activity
        </Button>
      </div>
    </div>
  );
}

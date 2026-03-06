'use client';
import React from 'react';
import { Input }   from './forms/Input';
import { Select }  from './forms/Select';
import { Button }  from './Button';
import type { IconName } from './Icon';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: { label: string; value: string }[];
  placeholder?: string;
  icon?: IconName;
}

export interface FilterPanelProps {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset?: () => void;
  /** 'vertical' (sidebar) | 'horizontal' (toolbar row) */
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

/**
 * Configurable filter panel supporting text search and select dropdowns.
 * Works as a sidebar (vertical) or inline toolbar row (horizontal).
 *
 * @example
 * <FilterPanel
 *   layout="horizontal"
 *   fields={[
 *     { key: 'search', label: 'Search', type: 'text', icon: 'Search' },
 *     { key: 'status', label: 'Status', type: 'select',
 *       options: [{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }] },
 *   ]}
 *   values={filters}
 *   onChange={(key, val) => setFilters(f => ({ ...f, [key]: val }))}
 *   onReset={() => setFilters({})}
 * />
 */
export function FilterPanel({
  fields,
  values,
  onChange,
  onReset,
  layout = 'vertical',
  className = '',
}: FilterPanelProps) {
  return (
    <div className={`tos-filter-panel tos-filter-panel--${layout}${className ? ` ${className}` : ''}`}>
      {fields.map((field) => (
        <div key={field.key} className="tos-filter-panel__field">
          {field.type === 'text' && (
            <Input
              label={layout === 'vertical' ? field.label : undefined}
              placeholder={field.placeholder ?? `Search ${field.label.toLowerCase()}…`}
              value={values[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              icon={field.icon}
              inputSize="sm"
              clearable
              onClear={() => onChange(field.key, '')}
            />
          )}
          {field.type === 'select' && (
            <Select
              label={layout === 'vertical' ? field.label : undefined}
              value={values[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              inputSize="sm"
            >
              <option value="">{field.placeholder ?? `All ${field.label.toLowerCase()}s`}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          )}
        </div>
      ))}

      {onReset && (
        <div className="tos-filter-panel__reset">
          <Button color="secondary" variant="ghost" size="sm" leftIcon="RotateCcw" onClick={onReset}>
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}

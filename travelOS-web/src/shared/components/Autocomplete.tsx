'use client';
import { forwardRef } from 'react';
import { CAutocomplete } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type AutocompleteProps = ComponentProps<typeof CAutocomplete>;

export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(
  (props, ref) => <CAutocomplete ref={ref} {...props} />,
);
Autocomplete.displayName = 'Autocomplete';

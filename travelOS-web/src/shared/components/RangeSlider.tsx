'use client';
import { forwardRef } from 'react';
import { CRangeSlider } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type RangeSliderProps = ComponentProps<typeof CRangeSlider>;

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (props, ref) => <CRangeSlider ref={ref} {...props} />,
);
RangeSlider.displayName = 'RangeSlider';

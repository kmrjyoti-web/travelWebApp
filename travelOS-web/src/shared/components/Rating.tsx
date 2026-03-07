'use client';
import { forwardRef } from 'react';
import { CRating } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type RatingProps = ComponentProps<typeof CRating>;

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (props, ref) => <CRating ref={ref} {...props} />,
);
Rating.displayName = 'Rating';

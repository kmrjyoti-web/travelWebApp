'use client';
import React from 'react';
import { CTooltip } from '@coreui/react';
import type { ComponentProps } from 'react';

export type TooltipProps = ComponentProps<typeof CTooltip>;

export const Tooltip = (props: TooltipProps) => <CTooltip {...props} />;
Tooltip.displayName = 'Tooltip';

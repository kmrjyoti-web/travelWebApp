'use client';
import { CButtonGroup, CButtonToolbar } from '@coreui/react';
import type { ComponentProps } from 'react';

export type ButtonGroupProps   = ComponentProps<typeof CButtonGroup>;
export type ButtonToolbarProps = ComponentProps<typeof CButtonToolbar>;

export function ButtonGroup(props: ButtonGroupProps)     { return <CButtonGroup {...props} />; }
export function ButtonToolbar(props: ButtonToolbarProps) { return <CButtonToolbar {...props} />; }

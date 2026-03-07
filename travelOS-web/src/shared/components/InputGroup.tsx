'use client';
import { CInputGroup, CInputGroupText } from '@coreui/react';
import type { ComponentProps } from 'react';

export type InputGroupProps = ComponentProps<typeof CInputGroup>;

export function InputGroup(props: InputGroupProps) { return <CInputGroup {...props} />; }

// CInputGroupText is polymorphic — re-export directly
export { CInputGroupText as InputGroupText };
export type { CInputGroupText };

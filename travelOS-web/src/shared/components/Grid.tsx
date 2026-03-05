'use client';
import React from 'react';
import { CContainer, CRow, CCol } from '@coreui/react';
import type { ComponentProps } from 'react';

export type ContainerProps = ComponentProps<typeof CContainer>;
export type RowProps = ComponentProps<typeof CRow>;
export type ColProps = ComponentProps<typeof CCol>;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>((props, ref) => <CContainer ref={ref} {...props} />);
Container.displayName = 'Container';

export const Row = React.forwardRef<HTMLDivElement, RowProps>((props, ref) => <CRow ref={ref} {...props} />);
Row.displayName = 'Row';

export const Col = React.forwardRef<HTMLDivElement, ColProps>((props, ref) => <CCol ref={ref} {...props} />);
Col.displayName = 'Col';

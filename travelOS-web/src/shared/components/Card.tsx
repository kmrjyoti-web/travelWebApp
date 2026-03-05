'use client';
import React from 'react';
import { CCard, CCardBody, CCardHeader, CCardFooter, CCardTitle, CCardSubtitle, CCardText, CCardImage } from '@coreui/react';
import type { ComponentProps } from 'react';

export type CardProps = ComponentProps<typeof CCard>;
export type CardBodyProps = ComponentProps<typeof CCardBody>;
export type CardHeaderProps = ComponentProps<typeof CCardHeader>;
export type CardFooterProps = ComponentProps<typeof CCardFooter>;
export type CardTitleProps = ComponentProps<typeof CCardTitle>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => <CCard ref={ref} {...props} />);
Card.displayName = 'Card';

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>((props, ref) => <CCardBody ref={ref} {...props} />);
CardBody.displayName = 'CardBody';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => <CCardHeader ref={ref} {...props} />);
CardHeader.displayName = 'CardHeader';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>((props, ref) => <CCardFooter ref={ref} {...props} />);
CardFooter.displayName = 'CardFooter';

// Re-export polymorphic sub-components directly — CoreUI Props<"el"> types are not compatible with ComponentProps
export const CardTitle = CCardTitle;
export const CardSubtitle = CCardSubtitle;
export const CardText = CCardText;
export const CardImage = CCardImage;

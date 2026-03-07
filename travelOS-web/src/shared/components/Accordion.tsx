'use client';
import {
  CAccordion,
  CAccordionBody,
  CAccordionButton,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react';
import type { ComponentProps } from 'react';

export type AccordionProps     = ComponentProps<typeof CAccordion>;
export type AccordionItemProps = ComponentProps<typeof CAccordionItem>;

export function Accordion(props: AccordionProps)           { return <CAccordion {...props} />; }
export function AccordionItem(props: AccordionItemProps)   { return <CAccordionItem {...props} />; }
export function AccordionHeader(props: ComponentProps<typeof CAccordionHeader>) { return <CAccordionHeader {...props} />; }
export function AccordionButton(props: ComponentProps<typeof CAccordionButton>) { return <CAccordionButton {...props} />; }
export function AccordionBody(props: ComponentProps<typeof CAccordionBody>)     { return <CAccordionBody {...props} />; }

import type { Metadata } from 'next';
import B2BPageContent from './B2BPageContent';

export const metadata: Metadata = { title: 'B2B Marketplace' };

export default function B2BPage() {
  return <B2BPageContent />;
}

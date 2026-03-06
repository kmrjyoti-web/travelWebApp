import type { Metadata } from 'next';
import AnalyticsPageContent from './AnalyticsPageContent';

export const metadata: Metadata = { title: 'Analytics' };

export default function AnalyticsPage() {
  return <AnalyticsPageContent />;
}

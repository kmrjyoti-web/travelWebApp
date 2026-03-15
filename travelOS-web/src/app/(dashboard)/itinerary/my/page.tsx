import type { Metadata } from 'next';
import { PageToolbar } from '@/shared/components';

export const metadata: Metadata = { title: 'My Itinerary' };

export default function MyItineraryPage() {
  return <PageToolbar title="My Itinerary" />;
}

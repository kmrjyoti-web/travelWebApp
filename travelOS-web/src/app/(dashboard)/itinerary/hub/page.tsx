import type { Metadata } from 'next';
import { ItineraryHub } from '@/features/itinerary';

export const metadata: Metadata = { title: 'Itinerary Hub' };

export default function ItineraryHubPage() {
  return <ItineraryHub />;
}

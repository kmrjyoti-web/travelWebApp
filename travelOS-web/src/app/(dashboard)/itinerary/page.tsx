import type { Metadata } from 'next';
import ItineraryPageContent from './ItineraryPageContent';

export const metadata: Metadata = { title: 'Itinerary' };

export default function ItineraryPage() {
  return <ItineraryPageContent />;
}
